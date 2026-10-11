from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.contract import Contract
from app.middleware.auth import get_current_user
from app.database import get_db

def get_current_tenant_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not associated with an organization."
        )
    return current_user

def get_tenant_contract(contract_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_tenant_user)) -> Contract:
    contract = db.query(Contract).filter(
        Contract.id == contract_id,
        Contract.organization_id == current_user.organization_id
    ).first()
    
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found or access denied."
        )
    return contract
