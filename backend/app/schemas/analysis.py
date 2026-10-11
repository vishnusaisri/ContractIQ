from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ExtractedRenewal(BaseModel):
    type: Optional[str] = "manual" # auto, manual, none
    renewal_period: Optional[str] = None
    notice_period_days: Optional[int] = None

class ExtractedClause(BaseModel):
    clause_type: str
    clause_text: str
    page_number: Optional[int] = 1
    risk_level: Optional[str] = "LOW"
    risk_reason: Optional[str] = None

class ExtractedObligation(BaseModel):
    responsible_party: str
    description: str
    due_date: Optional[str] = None
    frequency: Optional[str] = "One-time"
    priority: Optional[str] = "Medium"

class AIAnalysisResult(BaseModel):
    contract_name: str
    contract_type: str
    parties: List[str] = []
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None
    renewal: ExtractedRenewal = ExtractedRenewal()
    payment_terms: Optional[str] = None
    termination_terms: Optional[str] = None
    governing_law: Optional[str] = None
    contract_value: Optional[float] = None
    currency: Optional[str] = "INR"
    summary: str
    clauses: List[ExtractedClause] = []
    obligations: List[ExtractedObligation] = []
    potential_risks: List[str] = []
