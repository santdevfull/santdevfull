"""Durable SQLite job queue with atomic claiming and retry states."""
import hmac
import json
import os
import sqlite3
from contextlib import contextmanager, asynccontextmanager
from fastapi import FastAPI, Header, Depends, HTTPException
from pydantic import BaseModel, Field

@contextmanager
def db(immediate=False):
    con=sqlite3.connect(os.getenv("DB_PATH","queue.db"), timeout=10)
    con.row_factory=sqlite3.Row
    try:
        if immediate: con.execute("BEGIN IMMEDIATE")
        yield con
        con.commit()
    except:
        con.rollback()
        raise
    finally: con.close()

@asynccontextmanager
async def lifespan(app):
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, result TEXT)")
    yield

app=FastAPI(title="QueueCraft",version="1.0.0",lifespan=lifespan)

def admin(x_api_key: str | None=Header(default=None)):
    secret=os.environ.get("API_KEY","")
    if not secret or not x_api_key or not hmac.compare_digest(x_api_key,secret):raise HTTPException(401,"Invalid API key")

class JobIn(BaseModel):
    key: str = Field(min_length=4,max_length=100)
    name: str = Field(min_length=3,max_length=80)
    payload: dict = Field(default_factory=dict)

class ResultIn(BaseModel):
    result: str = Field(max_length=1000)

@app.get("/health")
def health():return {"status":"ok"}

@app.get("/jobs",dependencies=[Depends(admin)])
def jobs():
    with db() as con:
        return [{**dict(row),"payload":json.loads(row["payload"])} for row in con.execute("SELECT * FROM jobs ORDER BY id DESC")]

@app.post("/jobs",status_code=201,dependencies=[Depends(admin)])
def enqueue(item:JobIn):
    data=json.dumps(item.payload,ensure_ascii=False)
    if len(data)>10000:raise HTTPException(413,"Payload too large")
    with db(immediate=True) as con:
        found=con.execute("SELECT id,name,payload FROM jobs WHERE key=?",(item.key,)).fetchone()
        if found:
            if found["name"]!=item.name or found["payload"]!=data:raise HTTPException(409,"Conflicting idempotency key")
            return {"id":found["id"],"idempotent":True}
        cur=con.execute("INSERT INTO jobs(key,name,payload,status) VALUES (?,?,?,?)",(item.key,item.name,data,"pending"))
        return {"id":cur.lastrowid,"idempotent":False}

@app.post("/jobs/claim",dependencies=[Depends(admin)])
def claim():
    with db(immediate=True) as con:
        row=con.execute("SELECT id,name,payload,attempts FROM jobs WHERE status='pending' ORDER BY id LIMIT 1").fetchone()
        if row is None:return {"job":None}
        con.execute("UPDATE jobs SET status='processing',attempts=attempts+1 WHERE id=?",(row["id"],))
        return {"job":{**dict(row),"payload":json.loads(row["payload"]),"attempts":row["attempts"]+1}}

@app.post("/jobs/{job_id}/complete",dependencies=[Depends(admin)])
def complete(job_id:int,item:ResultIn):
    with db(immediate=True) as con:
        cur=con.execute("UPDATE jobs SET status='done',result=? WHERE id=? AND status='processing'",(item.result,job_id))
        if not cur.rowcount:raise HTTPException(409,"Job not processing")
    return {"id":job_id,"status":"done"}

@app.post("/jobs/{job_id}/fail",dependencies=[Depends(admin)])
def fail(job_id:int):
    with db(immediate=True) as con:
        row=con.execute("SELECT attempts,status FROM jobs WHERE id=?",(job_id,)).fetchone()
        if not row or row["status"]!="processing":raise HTTPException(409,"Job not processing")
        status="pending" if row["attempts"]<3 else "dead"
        con.execute("UPDATE jobs SET status=? WHERE id=?",(status,job_id))
    return {"id":job_id,"status":status}

@app.get("/metrics",dependencies=[Depends(admin)])
def metrics():
    with db() as con:
        return dict(con.execute("SELECT count(*) AS total,sum(status='pending') AS pending,sum(status='processing') AS processing,sum(status='done') AS done,sum(status='dead') AS dead FROM jobs").fetchone())
