import os
import tempfile
from pathlib import Path
os.environ["DB_PATH"]=str(Path(tempfile.mkdtemp())/"flags.db")
os.environ["API_KEY"]="ci-test-key"
from fastapi.testclient import TestClient
from app.main import app
AUTH={"X-API-Key":"ci-test-key"}

def test_auth_and_lifecycle():
    with TestClient(app) as c:
        assert c.get("/health").status_code==200
        assert c.post("/flags",json={"name":"new-ui"}).status_code==401
        assert c.post("/flags",headers=AUTH,json={"name":"new-ui","percentage":50}).status_code==201
        assert c.post("/flags",headers=AUTH,json={"name":"new-ui"}).status_code==409
        a=c.get("/evaluate/new-ui",params={"subject":"user-123"}).json()
        b=c.get("/evaluate/new-ui",params={"subject":"user-123"}).json()
        assert a==b
        assert c.patch("/flags/new-ui",headers=AUTH,json={"enabled":False,"percentage":100}).status_code==200
        assert c.get("/evaluate/new-ui",params={"subject":"user-123"}).json()["enabled"] is False

def test_boundaries_and_errors():
    with TestClient(app) as c:
        assert c.post("/flags",headers=AUTH,json={"name":"bad name"}).status_code==422
        assert c.post("/flags",headers=AUTH,json={"name":"gradual","percentage":0}).status_code==201
        assert c.get("/evaluate/gradual",params={"subject":"a"}).json()["enabled"] is False
        assert c.patch("/flags/gradual",headers=AUTH,json={"enabled":True,"percentage":100}).status_code==200
        assert c.get("/evaluate/gradual",params={"subject":"a"}).json()["enabled"] is True
        assert c.patch("/flags/nope",headers=AUTH,json={"enabled":True,"percentage":1}).status_code==404
