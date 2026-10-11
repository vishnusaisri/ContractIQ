# ContractIQ API Reference

ContractIQ provides OpenAPI 3.0 documentation at `/docs` or `/redoc` when the backend is running.

## Authentication Endpoints
- `POST /api/auth/register`: Register company organization & owner user.
- `POST /api/auth/login`: Authenticate and receive JWT access token.
- `GET /api/auth/me`: Get current authenticated user profile.

## Contract Endpoints
- `POST /api/contracts/upload`: Upload contract file (PDF/DOCX/TXT), trigger parsing, AI extraction, risk engine calculation, and alert generation.
- `GET /api/contracts`: List tenant contracts with search and risk filters.
- `GET /api/contracts/{id}`: Retrieve detailed contract with clauses, obligations, and risk breakdown.
- `DELETE /api/contracts/{id}`: Delete contract and associated resources under tenant authorization.

## Intelligence & Search
- `POST /api/contracts/compare`: Side-by-side comparison of 2 contracts (key term diffs, clause modifications, AI change briefing).
- `POST /api/search/query`: Ask ContractIQ natural language Q&A search across tenant contract portfolio.

## Obligations & Alerts
- `GET /api/obligations`: List tenant contractual obligations.
- `PATCH /api/obligations/{id}`: Update obligation status (Pending, In Progress, Completed, Overdue).
- `GET /api/alerts`: List organization alerts.
- `PATCH /api/alerts/{id}`: Mark alert read/resolved.

## Dashboard & Seed
- `GET /api/dashboard`: KPI metrics, upcoming renewals table, risk distribution, action center.
- `POST /api/demo/seed`: Seed 5 realistic sample contracts into organization.
