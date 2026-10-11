import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.models import Organization, User, Contract, Clause, Obligation, Alert, AuditLog
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tenant_db.db"
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

def test_multi_tenant_isolation_security():
    """
    CRITICAL MANDATORY SECURITY TEST:
    Verify User from Organization A CANNOT access or delete Organization B's contract.
    """
    # 1. Register User A in Organization A
    res_a = client.post("/api/auth/register", json={
        "name": "Org A Owner",
        "company_name": "Company A",
        "email": "owner@companya.com",
        "password": "Password123!"
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register User B in Organization B
    res_b = client.post("/api/auth/register", json={
        "name": "Org B Owner",
        "company_name": "Company B",
        "email": "owner@companyb.com",
        "password": "Password123!"
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Seed demo contracts for Org A
    seed_a = client.post("/api/demo/seed", headers=headers_a)
    assert seed_a.status_code == 201

    # Get Org A's contracts
    contracts_a = client.get("/api/contracts", headers=headers_a).json()
    assert len(contracts_a) > 0
    org_a_contract_id = contracts_a[0]["id"]

    # 4. Attempt to access Org A's contract using User B's token -> MUST FAIL (404/403)
    hack_get = client.get(f"/api/contracts/{org_a_contract_id}", headers=headers_b)
    assert hack_get.status_code in [404, 403], f"Security failure! User B accessed Org A's contract: {hack_get.json()}"

    # 5. Attempt to delete Org A's contract using User B's token -> MUST FAIL (404/403)
    hack_del = client.delete(f"/api/contracts/{org_a_contract_id}", headers=headers_b)
    assert hack_del.status_code in [404, 403], f"Security failure! User B deleted Org A's contract: {hack_del.json()}"
