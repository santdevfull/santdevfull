# FlagPilot
Feature-flag API with deterministic percentage rollout and persistent configuration.

## Endpoints
- GET /health
- GET /flags (API key)
- POST /flags and PATCH /flags/{name} (API key)
- GET /evaluate/{name}?subject=user-123 (returns stable bucket 0..9999)

The rollout uses SHA-256 with a per-flag random salt. Percentage values from 0 to 100 use an integer threshold. Subjects are plaintext in request/response but are not stored in the database.

## Local
Set API_KEY; install pip install -r requirements.txt; run uvicorn app.main:app --reload. Interactive API docs: http://localhost:8000/docs. Test with python -m pytest -q tests.

This demo is not a production feature-management platform: add authorization scopes, metrics, migration strategy and audit logging for production. GitHub Pages hosts documentation, not the backend. MIT.
