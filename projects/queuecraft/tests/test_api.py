import os
import tempfile
from pathlib import Path
os.environ["DB_PATH"]=str(Path(tempfile.mkdtemp())/"queue.db")
os.environ["API_KEY"]="ci-test-key"
from fastapi.testclient import TestClient
from app.main import app
AUTH={"X-API-Key":"ci-test-key"}

def test_idempotency_claim_and_complete():
    with TestClient(app) as c:
        assert c.post("/jobs",json={"key":"key123","name":"send-mail"}).status_code==401
        data={"key":"key123","name":"send-mail","payload":{"to":"test@example.org"}}
        first=c.post("/jobs",headers=AUTH,json=data)
        assert first.status_code==201
        assert c.post("/jobs",headers=AUTH,json=data).json()["idempotent"] is True
        assert c.post("/jobs",headers=AUTH,json={**data,"name":"change"}).status_code==409
        picked=c.post("/jobs/claim",headers=AUTH).json()["job"]
        assert picked["id"]==first.json()["id"]
        assert c.post("/jobs/claim",headers=AUTH).json()["job"] is None
        assert c.post("/jobs/"+str(picked["id"])+"/complete",headers=AUTH,json={"result":"ok"}).status_code==200
        assert c.post("/jobs/"+str(picked["id"])+"/complete",headers=AUTH,json={"result":"again"}).status_code==409

def test_retry_and_dead_letter():
    with TestClient(app) as c:
        x=c.post("/jobs",headers=AUTH,json={"key":"retry-key","name":"convert"}).json()["id"]
        for attempt in range(3):
            assert c.post("/jobs/claim",headers=AUTH).json()["job"]["id"]==x
            result=c.post("/jobs/"+str(x)+"/fail",headers=AUTH).json()
            assert result["status"]==("pending" if attempt<2 else "dead")
        assert c.post("/jobs/claim",headers=AUTH).json()["job"] is None
        assert c.get("/metrics",headers=AUTH).json()["dead"]>=1
