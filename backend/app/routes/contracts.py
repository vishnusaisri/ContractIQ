import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.clause import Clause
from app.models.obligation import Obligation
from app.schemas.contract import ContractResponse, ContractDetailResponse
from app.middleware.tenant import get_current_tenant_user, get_tenant_contract
from app.utils.validators import validate_uploaded_file
from app.services.document_parser import DocumentParser
from app.services.ai_analyzer import AIAnalyzer
from app.services.risk_engine import RiskEngine
from app.services.notification_service import NotificationService
from app.utils.dates import parse_date
from app.config import settings

router = APIRouter(prefix="/contracts", tags=["Contracts"])
ai_analyzer = AIAnalyzer()

@router.post("/upload", response_model=ContractDetailResponse, status_code=status.HTTP_201_CREATED)
async def upload_contract(
    file: UploadFile = File(...),
    contract_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_tenant_user)
):
    """
    Primary SaaS Workflow: Upload Contract -> Parsing -> AI Extraction -> Deterministic Risk Engine -> Structured DB Persistence.
    """
    file_bytes = await file.read()
    file_size = len(file_bytes)
    filename = file.filename

    is_valid, err_msg = validate_uploaded_file(filename, file_size)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    # Local storage
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    save_path = os.path.join(settings.STORAGE_DIR, f"{current_user.organization_id}_{filename}")
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    # 1. Parsing
    try:
        extracted_text, page_count = DocumentParser.parse_file(file_bytes, filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Text extraction failed: {str(e)}")

    # 2. AI Analysis
    analysis_data = ai_analyzer.analyze_contract(extracted_text, filename)

    # 3. Deterministic Risk Engine Calculation
    risk_score, risk_level, score_breakdown = RiskEngine.calculate_risk(analysis_data, extracted_text)

    # 4. Save Contract
    start_d = parse_date(analysis_data.get("effective_date"))
    end_d = parse_date(analysis_data.get("expiration_date"))
    renewal_info = analysis_data.get("renewal", {})
    ren_d = parse_date(renewal_info.get("renewal_date")) or (end_d if renewal_info.get("type") == "auto" else None)

    c_name = contract_name if contract_name else analysis_data.get("contract_name", filename)

    contract = Contract(
        organization_id=current_user.organization_id,
        uploaded_by=current_user.id,
        contract_name=c_name,
        contract_type=analysis_data.get("contract_type", "General Contract"),
        file_name=filename,
        file_url=save_path,
        status="COMPLETED",
        start_date=start_d,
        end_date=end_d,
        renewal_date=ren_d,
        renewal_type=renewal_info.get("type", "manual"),
        notice_period_days=renewal_info.get("notice_period_days"),
        contract_value=analysis_data.get("contract_value"),
        currency=analysis_data.get("currency", "INR"),
        risk_score=risk_score,
        risk_level=risk_level,
        summary=analysis_data.get("summary"),
        raw_text=extracted_text[:10000] # Store preview text
    )
    db.add(contract)
    db.flush()

    # 5. Save Clauses
    db_clauses = []
    for cl in analysis_data.get("clauses", []):
        clause_obj = Clause(
            contract_id=contract.id,
            clause_type=cl.get("clause_type", "other"),
            clause_text=cl.get("clause_text", ""),
            page_number=cl.get("page_number", 1),
            risk_level=cl.get("risk_level", "LOW"),
            risk_score=15 if cl.get("risk_level") == "HIGH" else (25 if cl.get("risk_level") == "CRITICAL" else 0),
            explanation=cl.get("risk_reason", "")
        )
        db.add(clause_obj)
        db_clauses.append(clause_obj)

    # 6. Save Obligations
    db_obligations = []
    for ob in analysis_data.get("obligations", []):
        ob_obj = Obligation(
            contract_id=contract.id,
            responsible_party=ob.get("responsible_party", "Counterparty"),
            description=ob.get("description", ""),
            due_date=parse_date(ob.get("due_date")),
            frequency=ob.get("frequency", "One-time"),
            status="Pending",
            priority=ob.get("priority", "Medium")
        )
        db.add(ob_obj)
        db_obligations.append(ob_obj)

    db.commit()
    db.refresh(contract)

    # 7. Generate Alerts
    NotificationService.generate_contract_alerts(contract, db)

    resp_dict = ContractDetailResponse.model_validate(contract)
    resp_dict.score_breakdown = score_breakdown
    return resp_dict

@router.get("", response_model=List[ContractResponse])
def list_contracts(
    search: Optional[str] = Query(None),
    contract_type: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Lists tenant contracts with filtering and search.
    """
    query = db.query(Contract).filter(Contract.organization_id == current_user.organization_id)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Contract.contract_name.ilike(s)) |
            (Contract.contract_type.ilike(s)) |
            (Contract.summary.ilike(s))
        )
    if contract_type:
        query = query.filter(Contract.contract_type == contract_type)
    if risk_level:
        query = query.filter(Contract.risk_level == risk_level)
    if status_filter:
        query = query.filter(Contract.status == status_filter)

    return query.order_by(Contract.created_at.desc()).all()

@router.get("/{contract_id}", response_model=ContractDetailResponse)
def get_contract_detail(
    contract: Contract = Depends(get_tenant_contract),
    db: Session = Depends(get_db)
):
    """
    Returns full contract details, clauses, obligations, and risk score breakdown.
    """
    # Re-evaluate score breakdown dynamically for transparent view
    analysis_stub = {
        "clauses": [{"clause_type": c.clause_type, "clause_text": c.clause_text, "risk_level": c.risk_level} for c in contract.clauses],
        "renewal": {"type": contract.renewal_type, "notice_period_days": contract.notice_period_days},
        "payment_terms": contract.summary or "",
        "contract_type": contract.contract_type or ""
    }
    _, _, score_breakdown = RiskEngine.calculate_risk(analysis_stub, contract.raw_text or "")

    resp = ContractDetailResponse.model_validate(contract)
    resp.score_breakdown = score_breakdown
    return resp

@router.delete("/{contract_id}", status_code=204)
def delete_contract(
    contract: Contract = Depends(get_tenant_contract),
    db: Session = Depends(get_db)
):
    """
    Deletes a contract and associated clauses/obligations under tenant isolation.
    """
    db.delete(contract)
    db.commit()
