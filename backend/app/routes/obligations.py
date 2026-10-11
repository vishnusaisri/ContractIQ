from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.obligation import Obligation
from app.schemas.obligation import ObligationResponse, ObligationUpdate
from app.middleware.tenant import get_current_tenant_user

router = APIRouter(prefix="/obligations", tags=["Obligations"])

@router.get("", response_model=List[ObligationResponse])
def list_organization_obligations(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Lists all contractual obligations across the tenant organization.
    """
    query = db.query(Obligation).join(Contract).filter(Contract.organization_id == current_user.organization_id)
    
    if status_filter:
        query = query.filter(Obligation.status == status_filter)
        
    obligations = query.order_by(Obligation.due_date.asc().nullslast()).all()

    # Populate contract_name for list UI
    res = []
    for ob in obligations:
        item = ObligationResponse.model_validate(ob)
        item.contract_name = ob.contract.contract_name if ob.contract else "Unknown Contract"
        res.append(item)
    return res

@router.patch("/{obligation_id}", response_model=ObligationResponse)
def update_obligation_status(
    obligation_id: str,
    ob_update: ObligationUpdate,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Updates obligation status, responsible party, or due date under tenant authorization.
    """
    obligation = db.query(Obligation).join(Contract).filter(
        Obligation.id == obligation_id,
        Contract.organization_id == current_user.organization_id
    ).first()

    if not obligation:
        raise HTTPException(status_code=404, detail="Obligation not found or access denied.")

    if ob_update.status is not None:
        obligation.status = ob_update.status
    if ob_update.responsible_party is not None:
        obligation.responsible_party = ob_update.responsible_party
    if ob_update.due_date is not None:
        obligation.due_date = ob_update.due_date
    if ob_update.priority is not None:
        obligation.priority = ob_update.priority

    db.commit()
    db.refresh(obligation)

    item = ObligationResponse.model_validate(obligation)
    item.contract_name = obligation.contract.contract_name if obligation.contract else "Unknown Contract"
    return item
