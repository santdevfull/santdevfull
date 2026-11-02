"""Deterministic feature flags with signed-in administration."""
import hashlib
import hmac
import os
import secrets
import sqlite3
from contextlib import contextmanager, asynccontextmanager
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

@contextmanager
def db():
    con = sqlite3.connect(os.getenv("DB_PATH", "flags.db"))
    con.row_factory = sqlite3.Row
    try:
        yield con
        con.commit()
    finally:
        con.close()

@asynccontextmanager
async def lifespan(app):
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS flags (name TEXT PRIMARY KEY, enabled INTEGER NOT NULL, percentage INTEGER NOT NULL, salt TEXT NOT NULL)")
    yield

app = FastAPI(title="FlagPilot", version="1.0.0", lifespan=lifespan)

def admin(x_api_key: str | None = Header(default=None)):
    secret = os.environ.get("API_KEY", "")
    if not secret or not x_api_key or not hmac.compare_digest(x_api_key, secret):
        raise HTTPException(401, "Invalid API key")

class FlagIn(BaseModel):
    name: str = Field(pattern=r"^[a-z][a-z0-9_-]{2,39}$")
    enabled: bool = True
    percentage: int = Field(default=100, ge=0, le=100)

class FlagUpdate(BaseModel):
    enabled: bool
    percentage: int = Field(ge=0, le=100)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/flags", dependencies=[Depends(admin)])
def list_flags():
    with db() as con:
        return [{k: (bool(row[k]) if k == "enabled" else row[k]) for k in ("name","enabled","percentage")} for row in con.execute("SELECT * FROM flags ORDER BY name")]

@app.post("/flags", status_code=201, dependencies=[Depends(admin)])
def create_flag(flag: FlagIn):
    with db() as con:
        try:
            con.execute("INSERT INTO flags VALUES (?,?,?,?)", (flag.name,int(flag.enabled),flag.percentage,secrets.token_hex(12)))
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Flag already exists")
    return flag.model_dump()

@app.patch("/flags/{name}", dependencies=[Depends(admin)])
def update_flag(name: str, item: FlagUpdate):
    with db() as con:
        cursor = con.execute("UPDATE flags SET enabled=?,percentage=? WHERE name=?", (int(item.enabled),item.percentage,name))
        if not cursor.rowcount:
            raise HTTPException(404, "Flag not found")
    return {"name":name,**item.model_dump()}

@app.get("/evaluate/{name}")
def evaluate(name: str, subject: str):
    if not 1 <= len(subject) <= 128:
        raise HTTPException(422, "Invalid subject")
    with db() as con:
        flag = con.execute("SELECT * FROM flags WHERE name=?", (name,)).fetchone()
    if flag is None:
        raise HTTPException(404, "Flag not found")
    digest = hashlib.sha256((flag["salt"]+":"+name+":"+subject).encode()).digest()
    bucket = int.from_bytes(digest[:8],"big") % 10000
    active = bool(flag["enabled"]) and bucket < flag["percentage"]*100
    return {"flag":name,"subject":subject,"enabled":active,"bucket":bucket}
