from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

class ObligationCreate(BaseModel):
    responsible_party: str
    description: str
    due_date: Optional[date] = None
    frequency: Optional[str] = "One-time"
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Medium"

class ObligationUpdate(BaseModel):
    responsible_party: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    frequency: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class ObligationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    responsible_party: str
    description: str
    due_date: Optional[date]
    frequency: Optional[str]
    status: str
    priority: str
    created_at: datetime
    contract_name: Optional[str] = None
