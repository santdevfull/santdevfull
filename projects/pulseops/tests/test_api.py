import os
import tempfile
from pathlib import Path

dbfile = Path(tempfile.mkdtemp()) / "test.db"
os.environ["PULSEOPS_DB"] = str(dbfile)
os.environ["PULSEOPS_API_KEY"] = "test-secret"

from fastapi.testclient import TestClient
from app.main import app

def test_workflow():
    with TestClient(app) as client:
        assert client.get("/health").json() == {"status":"ok"}
        assert client.post("/services",json={"name":"API","url":"https://example.com"}).status_code == 401
        headers = {"x-api-key":"test-secret"}
        svc = client.post("/services",headers=headers,json={"name":"API","url":"https://example.com"})
        assert svc.status_code == 201
        assert client.post("/services",headers=headers,json={"name":"API","url":"https://example.com"}).status_code == 409
        incident = client.post("/incidents",headers=headers,json={"service_id":svc.json()["id"],"title":"Service unavailable"})
        assert incident.status_code == 201
        assert client.get("/metrics").json()["operational"] is False
        changed = client.patch("/incidents/"+str(incident.json()["id"]),headers=headers,json={"status":"resolved"})
        assert changed.status_code == 200
        assert client.get("/metrics").json()["operational"] is True
        assert len(client.get("/incidents?status=resolved").json()) == 1
        assert client.patch("/incidents/999",headers=headers,json={"status":"resolved"}).status_code == 404

def test_validation():
    with TestClient(app) as client:
        h={"x-api-key":"test-secret"}
        assert client.post("/services",headers=h,json={"name":"x","url":"file://unsafe"}).status_code == 422
        assert client.post("/incidents",headers=h,json={"service_id":99999,"title":"Missing service"}).status_code == 404
