from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ClauseCreate(BaseModel):
    clause_type: str
    clause_text: str
    page_number: Optional[int] = None
    risk_level: Optional[str] = "LOW"
    risk_score: Optional[int] = 0
    explanation: Optional[str] = None

class ClauseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    contract_id: str
    clause_type: str
    clause_text: str
    page_number: Optional[int]
    risk_level: str
    risk_score: int
    explanation: Optional[str]
    created_at: datetime
