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

---

## 🚀 Deploying Frontend to Vercel

The frontend is fully configured with [frontend/vercel.json](file:///c:/Users/N%20vishnu%20sai%20sri/Downloads/PROJECTTTTTTTTTT%20SAASSS/frontend/vercel.json) to handle Single Page Application (SPA) routing without 404 errors.

### Method 1: Deploy via Vercel Dashboard & GitHub (Recommended)

1. **Push your repository to GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new).
   - Click **Import** next to your GitHub repository.
   - Set **Root Directory** to `frontend`.
   - Under **Framework Preset**, select **Vite** (auto-detected).
   - Under **Environment Variables**, add:
     - `VITE_API_BASE_URL`: `https://your-backend-api-url.onrender.com/api` (or your deployed backend URL).
   - Click **Deploy**.

### Method 2: Deploy via Vercel CLI

```bash
cd frontend
npx vercel
```
- Link to your Vercel account when prompted in the browser.
- Set build settings (Framework: Vite, Output: `dist`).

---

## ⚡ Deploying Backend (FastAPI) to Render or Railway

To pair with your Vercel frontend, deploy the Python FastAPI backend on Render or Railway:

### On Render (render.com):
1. Create a **New Web Service** pointing to your repository.
2. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   - `JWT_SECRET`: `your_random_secret_string`
   - `FRONTEND_URL`: `https://your-app.vercel.app`
   - `DATABASE_URL`: Your PostgreSQL connection string (or Render Managed PostgreSQL).

