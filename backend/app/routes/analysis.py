from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.contract import Contract
from app.models.clause import Clause
from app.models.obligation import Obligation
from app.schemas.clause import ClauseResponse
from app.schemas.obligation import ObligationResponse
from app.schemas.contract import ContractCompareRequest
from app.middleware.tenant import get_tenant_contract, get_current_tenant_user
from app.models.user import User
from app.services.comparison_service import ComparisonService

router = APIRouter(tags=["Analysis & Comparison"])

@router.get("/contracts/{contract_id}/clauses", response_model=List[ClauseResponse])
def get_contract_clauses(
    contract: Contract = Depends(get_tenant_contract),
    db: Session = Depends(get_db)
):
    return contract.clauses

@router.get("/contracts/{contract_id}/obligations", response_model=List[ObligationResponse])
def get_contract_obligations(
    contract: Contract = Depends(get_tenant_contract),
    db: Session = Depends(get_db)
):
    return contract.obligations

@router.post("/contracts/compare")
def compare_two_contracts(
    req: ContractCompareRequest,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Compares two tenant contracts side-by-side (Value, Notice, Liability, Clause Diffs, Risk score delta).
    """
    c1 = db.query(Contract).filter(Contract.id == req.contract_id_1, Contract.organization_id == current_user.organization_id).first()
    c2 = db.query(Contract).filter(Contract.id == req.contract_id_2, Contract.organization_id == current_user.organization_id).first()

    if not c1 or not c2:
        raise HTTPException(status_code=404, detail="One or both contracts were not found in your organization.")

    return ComparisonService.compare_contracts(c1, c2)
