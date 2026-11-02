# LedgerForge
Double-entry ledger API with accounts, atomic journals, integer-cent postings, and a zero-sum trial balance.

## Invariants
- A journal has at least two nonzero postings.
- Each journal balances to zero cents before commit.
- Every posting must reference an existing account; SQLite foreign keys enabled.
- No floating-point money.

## API
GET /health (public); POST/GET /accounts; POST /entries; GET /entries/{id}; GET /trial-balance (all authenticated except health). Configure API_KEY; run uvicorn app.main:app --reload; test python -m pytest -q tests.

This is a teaching implementation, not a regulated financial ledger. Production requires roles, idempotency, audit trail, multi-currency controls and legal review. Documentation only on GitHub Pages. MIT license.
