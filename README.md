# ContractIQ — AI-Powered Contract Intelligence SaaS

> **Turn contracts into actionable business intelligence.**

ContractIQ helps companies upload, organize, analyze, monitor, search, compare, and manage contracts using AI and a transparent deterministic risk engine.

---

## 🌟 Key Features

1. **Multi-Tenant SaaS Architecture**: Every organization has strictly isolated data backed by `organization_id` security verification on every API request.
2. **Document Parsing**: Extract text and page numbers from PDF, DOCX, and TXT documents.
3. **Abstracted AI Analyzer (`AIAnalyzer`)**: Flexible provider abstraction (Mock, OpenAI, Anthropic, Gemini). Extracts structured metadata, parties, effective/expiration dates, renewal terms, notice periods, clauses, obligations, and financial values without hallucination.
4. **Transparent Deterministic Risk Engine (`RiskEngine`)**: No black-box AI arithmetic. Scores contracts 0–100 (LOW, MEDIUM, HIGH, CRITICAL) using explicit rules:
   - +25 Unlimited liability
   - +20 Broad indemnification
   - +15 Auto-renewal clause
   - +15 Notice period > 90 days
   - +15 Missing SLA / uptime guarantee
   - +10 High termination penalty
   - +10 Liquidated damages / financial penalty
   - +5 Advance / unusual payment terms
5. **Contract Comparison Engine**: Side-by-side comparison of 2 contracts with diff badges (🔴, 🟠, 🟢), clause modifications, and AI briefing.
6. **Ask ContractIQ (Q&A Natural Language Search)**: Search contract portfolio in plain English with source contract references.
7. **Obligation Tracker & Renewal Calendar**: Actionable compliance tracking and chronological notice deadline timeline.
8. **1-Click Demo Mode**: Populate 5 production sample contracts (Vendor, SaaS, Employment, Service, NDA) with 1 click for instant demonstration.
9. **Human-Review Disclaimer**: Clear legal disclaimers stating AI analysis is for informational decision support only.

---

## 📂 Project Structure

```text
ContractIQ/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entrypoint
│   │   ├── config.py            # Pydantic Settings
│   │   ├── database.py          # SQLAlchemy engine & sessions
│   │   ├── models/              # User, Organization, Contract, Clause, Obligation, Alert, AuditLog
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── routes/              # Auth, Organizations, Contracts, Analysis, Obligations, Alerts, Search, Dashboard, Demo
│   │   ├── services/            # DocumentParser, AIAnalyzer, RiskEngine, SearchService, NotificationService, ComparisonService
│   │   ├── middleware/          # Auth JWT & Tenant isolation
│   │   └── utils/               # Security, dates, validators
│   ├── tests/                   # Pytest suite (Auth, Tenant Isolation Security, Risk Engine)
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, RiskGauge, FileUploader, StatusBadge, DisclaimerBanner, Modal
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, DashboardPage, ContractsListPage, ContractDetailPage, ContractComparePage, SearchQAContractPage, ObligationsPage, CalendarPage, AlertsPage, SettingsPage
│   │   ├── layouts/             # DashboardLayout
│   │   ├── contexts/            # AuthContext
│   │   └── services/            # Axios API client
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql               # PostgreSQL / SQLite SQL DDL
│
├── docs/                        # Architecture, API, and Deployment docs
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Option 1: Running with Docker Compose (Fastest)

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`

---

### Option 2: Running Locally (Manual Setup)

#### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --reload --port 8000
```
Backend server will run at `http://localhost:8000`.

#### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend app will run at `http://localhost:5173`.

---

## 🧪 Testing

Run pytest suite (includes multi-tenant security verification test confirming User from Org A cannot access Org B data):

```bash
cd backend
pytest -v
```

---

## 🔑 Demo Credentials

To test the application immediately:
1. Open `http://localhost:5173`
2. Click **"Sign In"** -> Click **"Instant Demo Access"** (or register a new organization account)
3. On the top navigation bar, click **"Load Demo Contracts"** to seed 5 realistic agreements with varied risk profiles and deadlines.

---

## ⚖️ Disclaimer

ContractIQ provides AI contract intelligence, extraction, risk scoring, and decision support for review purposes only. It does not replace legal counsel or provide definitive legal advice.
