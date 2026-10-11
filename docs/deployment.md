# ContractIQ Deployment Guide

## Docker Compose Setup (Recommended)

1. Clone repository and set up environment:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Run full containerized stack (PostgreSQL + FastAPI + Vite Frontend):
   ```bash
   docker compose up --build
   ```

3. Access application:
   - Frontend: `http://localhost:5173`
   - Backend API Docs: `http://localhost:8000/docs`

## Manual Local Development Setup

### Backend (Python 3.11+)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (Node.js 18+)
```bash
cd frontend
npm install
npm run dev
```
