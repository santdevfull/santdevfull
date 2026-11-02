"""Double-entry ledger with integer-cent balances and atomic postings."""
import hmac
import os
import sqlite3
from contextlib import contextmanager, asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, Header, HTTPException
from pydantic import BaseModel, Field

@contextmanager
def db(immediate=False):
    con=sqlite3.connect(os.getenv("DB_PATH","ledger.db"),timeout=10)
    con.row_factory=sqlite3.Row
    con.execute("PRAGMA foreign_keys=ON")
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
        con.execute("CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, label TEXT NOT NULL)")
        con.execute("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, memo TEXT NOT NULL, timestamp TEXT NOT NULL)")
        con.execute("CREATE TABLE IF NOT EXISTS postings (entry_id INTEGER NOT NULL REFERENCES entries(id), account_id INTEGER NOT NULL REFERENCES accounts(id), amount_cents INTEGER NOT NULL CHECK(amount_cents!=0))")
    yield

app=FastAPI(title="LedgerForge",version="1.0.0",lifespan=lifespan)
def auth(x_api_key:str|None=Header(default=None)):
    secret=os.getenv("API_KEY","")
    if not secret or not x_api_key or not hmac.compare_digest(x_api_key,secret):raise HTTPException(401,"Invalid API key")

class AccountIn(BaseModel):
    code: str=Field(pattern=r"^[A-Za-z0-9_-]{2,32}$")
    label: str=Field(min_length=2,max_length=100)
class PostingIn(BaseModel):
    account_id:int
    amount_cents:int=Field(ge=-100_000_000_00,le=100_000_000_00)
class EntryIn(BaseModel):
    memo: str=Field(min_length=3,max_length=250)
    postings:list[PostingIn]=Field(min_length=2,max_length=100)

@app.get("/health")
def health():return{"status":"ok"}

@app.post("/accounts",status_code=201,dependencies=[Depends(auth)])
def create_account(item:AccountIn):
    with db() as con:
        try:cur=con.execute("INSERT INTO accounts(code,label) VALUES(?,?)",(item.code,item.label))
        except sqlite3.IntegrityError:raise HTTPException(409,"Account already exists")
        return{"id":cur.lastrowid,**item.model_dump()}

@app.get("/accounts",dependencies=[Depends(auth)])
def accounts():
    with db() as con:
        return [dict(row) for row in con.execute("SELECT a.id,a.code,a.label,COALESCE(SUM(p.amount_cents),0) AS balance_cents FROM accounts a LEFT JOIN postings p ON p.account_id=a.id GROUP BY a.id ORDER BY a.id")]

@app.post("/entries",status_code=201,dependencies=[Depends(auth)])
def post_entry(item:EntryIn):
    amounts=[p.amount_cents for p in item.postings]
    if 0 in amounts or sum(amounts)!=0:
        raise HTTPException(422,"Postings must be nonzero and balance to zero")
    with db(immediate=True) as con:
        ids=[p.account_id for p in item.postings]
        present={row[0] for row in con.execute("SELECT id FROM accounts WHERE id IN ("+",".join("?" for _ in ids)+")",ids)}
        if any(i not in present for i in ids):raise HTTPException(404,"Account not found")
        cur=con.execute("INSERT INTO entries(memo,timestamp) VALUES (?,?)",(item.memo,datetime.now(timezone.utc).isoformat()))
        con.executemany("INSERT INTO postings(entry_id,account_id,amount_cents) VALUES(?,?,?)",[(cur.lastrowid,p.account_id,p.amount_cents) for p in item.postings])
        return{"id":cur.lastrowid,"memo":item.memo,"sum_cents":0,"postings":len(item.postings)}

@app.get("/entries/{entry_id}",dependencies=[Depends(auth)])
def entry(entry_id:int):
    with db() as con:
        row=con.execute("SELECT * FROM entries WHERE id=?",(entry_id,)).fetchone()
        if not row:raise HTTPException(404,"Entry not found")
        return {**dict(row),"postings":[dict(p) for p in con.execute("SELECT account_id,amount_cents FROM postings WHERE entry_id=?",(entry_id,))]}

@app.get("/trial-balance",dependencies=[Depends(auth)])
def trial_balance():
    rows=accounts()
    return{"accounts":rows,"net_cents":sum(r["balance_cents"] for r in rows)}
