# ContractIQ Architecture Documentation

## Overview
ContractIQ is a production-grade multi-tenant B2B Contract Intelligence SaaS platform. It combines automated document parsing (PDF, DOCX, TXT), AI clause classification (`AIAnalyzer`), a transparent deterministic risk calculation engine (`RiskEngine`), and a responsive enterprise frontend.

## Multi-Tenancy & Security Model
- **Tenant Isolation**: Every database record (`contracts`, `clauses`, `obligations`, `alerts`, `audit_logs`) is bound to an `organization_id`.
- **JWT Authorization**: User authentication returns a signed JWT token containing `sub` (user_id) and `org_id`.
- **Dependency Middleware**: FastAPI routes use `get_current_tenant_user` and `get_tenant_contract` to enforce tenant boundary checks automatically. Cross-tenant access attempts return `404 Not Found` or `403 Forbidden`.

## Component Layers

```text
[ React 18 + Vite + Tailwind Frontend ]
                │ (REST API / JSON)
                ▼
[ FastAPI Application & Tenant Middleware ]
        │                       │
        ▼                       ▼
[ Document Parser ]     [ AIAnalyzer Abstraction ]
 (PyMuPDF / docx)        (Mock / OpenAI / Gemini)
        │                       │
        └──────────┬────────────┘
                   ▼
       [ Deterministic Risk Engine ]
       (Scoring rules: +25, +20, +15...)
                   │
                   ▼
  [ PostgreSQL / SQLite Multi-Tenant DB ]
```

## Deterministic Risk Engine Scoring Rules
The AI layer extracts metadata and clause text, but risk scores are computed deterministically by Python logic:
- **Unlimited Liability**: +25 points
- **Broad Indemnification**: +20 points
- **Auto-Renewal Clause**: +15 points
- **Notice Period > 90 Days**: +15 points (> 60 days: +10 points)
- **Missing SLA / Service Level Agreement**: +15 points
- **High Termination Penalty**: +10 points
- **High Financial Penalty / Liquidated Damages**: +10 points
- **Unusual Payment Terms (Advance / Net 90+)**: +5 points

Max Score: 100.
Categories: LOW (0-25), MEDIUM (26-50), HIGH (51-75), CRITICAL (76-100).
