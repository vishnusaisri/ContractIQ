import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Import Models FIRST so Base.metadata has all table definitions registered!
from app.models import Organization, User, Contract, Clause, Obligation, Alert, AuditLog

# Auto-create tables for local environment
Base.metadata.create_all(bind=engine)

# Import Routers
from app.routes import auth, organizations, contracts, analysis, obligations, alerts, search, dashboard, demo

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ContractIQ - Turn contracts into actionable business intelligence. Production Multi-Tenant Contract Intelligence SaaS API.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(organizations.router, prefix=settings.API_V1_STR)
app.include_router(contracts.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(obligations.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "Turn contracts into actionable business intelligence.",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }
