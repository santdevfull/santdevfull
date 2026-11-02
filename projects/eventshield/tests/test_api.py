import hashlib
import hmac
import json
import os
import tempfile
import time
from pathlib import Path
os.environ["DB_PATH"]=str(Path(tempfile.mkdtemp())/"events.db")
os.environ["API_KEY"]="ci-test-key"
os.environ["WEBHOOK_SECRET"]="webhook-test-secret"
from fastapi.testclient import TestClient
from app.main import app

def signed(payload,event_id="evt-1",ts=None):
    body=json.dumps(payload,separators=(",",":")).encode()
    stamp=str(int(time.time()) if ts is None else ts)
    signature="sha256="+hmac.new(b"webhook-test-secret",stamp.encode()+b"."+body,hashlib.sha256).hexdigest()
    return body,{"X-Event-ID":event_id,"X-Event-Timestamp":stamp,"X-Event-Signature":signature,"Content-Type":"application/json"}

def test_hmac_and_duplicate():
    with TestClient(app) as c:
        body,headers=signed({"order":15})
        assert c.post("/events",content=body).status_code==400
        assert c.post("/events",content=body,headers={**headers,"X-Event-Signature":"bad"}).status_code==401
        result=c.post("/events",content=body,headers=headers)
        assert result.status_code==201 and result.json()["duplicate"] is False
        assert c.post("/events",content=body,headers=headers).json()["duplicate"] is True
        b,h=signed({"order":999})
        assert c.post("/events",content=b,headers=h).status_code==409
        assert c.get("/events").status_code==401
        assert c.get("/metrics",headers={"X-API-Key":"ci-test-key"}).json()["events_received"]==1

def test_replay_window():
    with TestClient(app) as c:
        body,headers=signed({"ok":True},"old",ts=int(time.time())-500)
        assert c.post("/events",content=body,headers=headers).status_code==401
        body,headers=signed({"ok":True},"other")
        assert c.post("/events",content=body,headers=headers).status_code==201
