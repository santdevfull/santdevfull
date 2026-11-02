import os
import tempfile
from pathlib import Path
os.environ["DB_PATH"]=str(Path(tempfile.mkdtemp())/"ledger.db")
os.environ["API_KEY"]="ci-test-key"
from fastapi.testclient import TestClient
from app.main import app
AUTH={"X-API-Key":"ci-test-key"}

def test_balanced_journal_and_trial_balance():
    with TestClient(app) as c:
        assert c.get("/accounts").status_code==401
        a=c.post("/accounts",headers=AUTH,json={"code":"bank","label":"Bank assets"}).json()["id"]
        b=c.post("/accounts",headers=AUTH,json={"code":"revenue","label":"Sales revenue"}).json()["id"]
        data={"memo":"Sale on invoice", "postings":[{"account_id":a,"amount_cents":12500},{"account_id":b,"amount_cents":-12500}]}
        result=c.post("/entries",headers=AUTH,json=data)
        assert result.status_code==201
        trial=c.get("/trial-balance",headers=AUTH).json()
        assert trial["net_cents"]==0
        assert [r["balance_cents"] for r in trial["accounts"]]==[12500,-12500]
        entry=c.get("/entries/"+str(result.json()["id"]),headers=AUTH).json()
        assert len(entry["postings"])==2

def test_atomic_validation():
    with TestClient(app) as c:
        a=c.get("/accounts",headers=AUTH).json()[0]["id"]
        bad={"memo":"Unbalanced", "postings":[{"account_id":a,"amount_cents":100},{"account_id":a,"amount_cents":-99}]}
        assert c.post("/entries",headers=AUTH,json=bad).status_code==422
        bad["postings"][1]={"account_id":99999,"amount_cents":-100}
        assert c.post("/entries",headers=AUTH,json=bad).status_code==404
        assert c.get("/trial-balance",headers=AUTH).json()["net_cents"]==0
        assert c.post("/accounts",headers=AUTH,json={"code":"bank","label":"Duplicate"}).status_code==409
