# QueueCraft
SQLite job queue API with idempotency keys, atomic FIFO claiming (BEGIN IMMEDIATE), controlled completion and three-attempt retry/dead-letter transitions.

## API
POST /jobs; POST /jobs/claim; POST /jobs/{id}/complete; POST /jobs/{id}/fail; GET /jobs; GET /metrics. All except GET /health require X-API-Key.

No executor/worker loop ships by default: callers claim tasks and report outcomes. Before deployment, add claim leases, crash recovery, access control, rate limiting and operational alerting. Payloads are demo data, not secrets.

Install pip install -r requirements.txt; set API_KEY; run uvicorn app.main:app --reload; test python -m pytest -q tests. MIT license. GitHub Pages documents only.
