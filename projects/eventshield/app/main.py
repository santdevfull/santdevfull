"""Authenticated HMAC-SHA256 webhook ingestion with replay controls."""
import hashlib
import hmac
import json
import os
import sqlite3
import time
from contextlib import contextmanager, asynccontextmanager
from fastapi import FastAPI, Request, Header, Depends, HTTPException

@contextmanager
def db(immediate=False):
    con=sqlite3.connect(os.getenv("DB_PATH","events.db"),timeout=10)
    con.row_factory=sqlite3.Row
    try:
        if immediate:con.execute("BEGIN IMMEDIATE")
        yield con
        con.commit()
    except:
        con.rollback()
        raise
    finally:con.close()

@asynccontextmanager
async def lifespan(app):
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, sha256 TEXT NOT NULL, payload TEXT NOT NULL, received_at INTEGER NOT NULL)")
    yield

app=FastAPI(title="EventShield",version="1.0.0",lifespan=lifespan)

def reader(x_api_key:str|None=Header(default=None)):
    secret=os.getenv("API_KEY","")
    if not secret or not x_api_key or not hmac.compare_digest(x_api_key,secret):raise HTTPException(401,"Invalid API key")

@app.get("/health")
def health():return{"status":"ok"}

@app.post("/events",status_code=201)
async def receive(req:Request, x_event_id:str|None=Header(default=None),x_event_timestamp:str|None=Header(default=None),x_event_signature:str|None=Header(default=None)):
    secret=os.getenv("WEBHOOK_SECRET","")
    if not secret:raise HTTPException(503,"Webhook not configured")
    if not x_event_id or not 1<=len(x_event_id)<=128:raise HTTPException(400,"Missing event ID")
    try:timestamp=int(x_event_timestamp or "")
    except ValueError:raise HTTPException(400,"Invalid timestamp")
    if abs(int(time.time())-timestamp)>300:raise HTTPException(401,"Timestamp outside acceptance window")
    payload=await req.body()
    if len(payload)>100000:raise HTTPException(413,"Payload too large")
    expected="sha256="+hmac.new(secret.encode(),x_event_timestamp.encode()+b"."+payload,hashlib.sha256).hexdigest()
    if not x_event_signature or not hmac.compare_digest(expected,x_event_signature):raise HTTPException(401,"Invalid signature")
    try:
        parsed=json.loads(payload)
        if not isinstance(parsed,dict):raise ValueError
    except (ValueError,UnicodeDecodeError):
        raise HTTPException(422,"Expected JSON object")
    digest=hashlib.sha256(payload).hexdigest()
    with db(immediate=True) as con:
        row=con.execute("SELECT sha256 FROM events WHERE id=?",(x_event_id,)).fetchone()
        if row:
            if row["sha256"]!=digest:raise HTTPException(409,"Event ID conflict")
            return{"event_id":x_event_id,"duplicate":True}
        con.execute("INSERT INTO events VALUES (?,?,?,?)",(x_event_id,digest,payload.decode("utf-8"),int(time.time())))
    return{"event_id":x_event_id,"duplicate":False}

@app.get("/events",dependencies=[Depends(reader)])
def events(limit:int=20):
    if not 1<=limit<=100:raise HTTPException(422,"Limit out of bounds")
    with db() as con:
        return [{**dict(row),"payload":json.loads(row["payload"])} for row in con.execute("SELECT id,sha256,payload,received_at FROM events ORDER BY received_at DESC,id DESC LIMIT ?",(limit,))]

@app.get("/metrics",dependencies=[Depends(reader)])
def metrics():
    with db() as con:
        return{"events_received":con.execute("SELECT COUNT(*) FROM events").fetchone()[0]}
