"""PulseOps ? REST API for service health and incident response."""
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, Field

app = FastAPI(title="PulseOps", description="Incident management and service status", version="1.0.0")
DB_PATH = os.environ.get("PULSEOPS_DB", "pulseops.db")

@contextmanager
def db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()

def init():
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, url TEXT NOT NULL, created_at TEXT NOT NULL)")
        con.execute("CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY, service_id INTEGER NOT NULL REFERENCES services(id), title TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('investigating','identified','monitoring','resolved')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL)")
        con.execute("PRAGMA foreign_keys=ON")

def timestamp():
    return datetime.now(timezone.utc).isoformat()

def auth(x_api_key: str | None = Header(default=None)):
    expected = os.getenv("PULSEOPS_API_KEY")
    if not expected or x_api_key != expected:
        raise HTTPException(401, "Invalid API key")

class ServiceIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    url: str = Field(pattern=r"^https?://", max_length=500)

class IncidentIn(BaseModel):
    service_id: int
    title: str = Field(min_length=3, max_length=200)

class IncidentPatch(BaseModel):
    status: str = Field(pattern=r"^(investigating|identified|monitoring|resolved)$")

@app.on_event("startup")
def startup():
    init()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/services")
def list_services():
    with db() as con:
        return [dict(row) for row in con.execute("SELECT * FROM services ORDER BY id DESC")]

@app.post("/services", status_code=201, dependencies=[Depends(auth)])
def add_service(item: ServiceIn):
    with db() as con:
        try:
            row = con.execute("INSERT INTO services(name,url,created_at) VALUES (?,?,?)", (item.name, item.url, timestamp()))
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Service already exists")
        return dict(con.execute("SELECT * FROM services WHERE id=?", (row.lastrowid,)).fetchone())

@app.get("/incidents")
def list_incidents(status: str | None = None):
    with db() as con:
        if status:
            rows = con.execute("SELECT * FROM incidents WHERE status=? ORDER BY id DESC", (status,))
        else:
            rows = con.execute("SELECT * FROM incidents ORDER BY id DESC")
        return [dict(row) for row in rows]

@app.post("/incidents", status_code=201, dependencies=[Depends(auth)])
def add_incident(item: IncidentIn):
    with db() as con:
        if con.execute("SELECT id FROM services WHERE id=?", (item.service_id,)).fetchone() is None:
            raise HTTPException(404, "Service not found")
        now = timestamp()
        cur = con.execute("INSERT INTO incidents(service_id,title,status,created_at,updated_at) VALUES (?,?,?,?,?)",
                          (item.service_id, item.title, "investigating", now, now))
        return dict(con.execute("SELECT * FROM incidents WHERE id=?", (cur.lastrowid,)).fetchone())

@app.patch("/incidents/{incident_id}", dependencies=[Depends(auth)])
def change_incident(incident_id: int, item: IncidentPatch):
    with db() as con:
        row = con.execute("SELECT * FROM incidents WHERE id=?", (incident_id,)).fetchone()
        if row is None:
            raise HTTPException(404, "Incident not found")
        con.execute("UPDATE incidents SET status=?,updated_at=? WHERE id=?", (item.status, timestamp(), incident_id))
        return dict(con.execute("SELECT * FROM incidents WHERE id=?", (incident_id,)).fetchone())

@app.get("/metrics")
def metrics():
    with db() as con:
        services = con.execute("SELECT COUNT(*) FROM services").fetchone()[0]
        open_count = con.execute("SELECT COUNT(*) FROM incidents WHERE status!='resolved'").fetchone()[0]
        return {"services": services, "open_incidents": open_count, "operational": open_count == 0}
