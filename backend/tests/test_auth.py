import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.models import Organization, User, Contract, Clause, Obligation, Alert, AuditLog
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth_db.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

def test_user_registration_and_login():
    # Register Org A
    reg_resp = client.post("/api/auth/register", json={
        "name": "Alice Manager",
        "company_name": "Tech Corp 2026",
        "email": "alice.test@techcorp.com",
        "password": "Password123!",
        "industry": "IT"
    })
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert data["role"] == "owner"

    # Login
    login_resp = client.post("/api/auth/login", json={
        "email": "alice.test@techcorp.com",
        "password": "Password123!"
    })
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()
