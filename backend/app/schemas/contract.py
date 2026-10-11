from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from app.schemas.clause import ClauseResponse
from app.schemas.obligation import ObligationResponse

class ContractResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    uploaded_by: Optional[str]
    contract_name: str
    contract_type: Optional[str]
    file_name: str
    file_url: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    renewal_date: Optional[date]
    renewal_type: Optional[str]
    notice_period_days: Optional[int]
    contract_value: Optional[float]
    currency: Optional[str]
    risk_score: int
    risk_level: str
    summary: Optional[str]
    created_at: datetime
    updated_at: datetime

class ContractDetailResponse(ContractResponse):
    clauses: List[ClauseResponse] = []
    obligations: List[ObligationResponse] = []
    score_breakdown: List[dict] = []

class ContractCompareRequest(BaseModel):
    contract_id_1: str
    contract_id_2: str

class SearchQueryRequest(BaseModel):
    query: str
