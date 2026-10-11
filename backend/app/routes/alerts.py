from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.alert import Alert
from app.middleware.tenant import get_current_tenant_user
from pydantic import BaseModel, ConfigDict
from datetime import date

router = APIRouter(prefix="/alerts", tags=["Alerts"])

class AlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    contract_id: Optional[str]
    alert_type: str
    alert_date: date
    message: str
    status: str

class AlertStatusUpdate(BaseModel):
    status: str # unread, read, resolved

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    return db.query(Alert).filter(Alert.organization_id == current_user.organization_id).order_by(Alert.created_at.desc()).all()

@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert_status(
    alert_id: str,
    update_in: AlertStatusUpdate,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.organization_id == current_user.organization_id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert.status = update_in.status
    db.commit()
    db.refresh(alert)
    return alert
