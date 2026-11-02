# EventShield
Secure webhook inbox with HMAC-SHA256 signature verification, timestamp expiration, event ID idempotency and SQLite audit records.

## Protocol
POST /events sends JSON plus X-Event-ID, X-Event-Timestamp (Unix seconds), X-Event-Signature (sha256=HEX). Signature covers bytes: timestamp + "." + raw payload bytes. HMAC key is WEBHOOK_SECRET. Timestamp window: +/-300 seconds. Duplicate event IDs with identical content are accepted; conflicting content returns HTTP 409.

GET /events and GET /metrics require X-API-Key (API_KEY env var). GET /health is public. Configure both secrets, install requirements and run uvicorn app.main:app --reload. Test python -m pytest -q tests.

The public GitHub Pages site is documentation only, not a live webhook receiver. Add request throttling, encryption at rest, retention policy, and secret rotation before production. MIT license.
