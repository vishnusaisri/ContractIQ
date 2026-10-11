from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import Dict, Any, List
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.obligation import Obligation
from app.models.alert import Alert
from app.middleware.tenant import get_current_tenant_user
from app.utils.dates import calculate_notice_deadline

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary(
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    org_id = current_user.organization_id
    today = date.today()
    in_90_days = today + timedelta(days=90)

    contracts = db.query(Contract).filter(Contract.organization_id == org_id).all()
    obligations = db.query(Obligation).join(Contract).filter(Contract.organization_id == org_id).all()
    alerts = db.query(Alert).filter(Alert.organization_id == org_id).order_by(Alert.created_at.desc()).limit(5).all()

    # 1. KPI Cards
    total_contracts = len(contracts)
    active_contracts = sum(1 for c in contracts if c.status == "COMPLETED")
    expiring_soon = sum(1 for c in contracts if c.end_date and today <= c.end_date <= in_90_days)
    high_risk = sum(1 for c in contracts if c.risk_level in ["HIGH", "CRITICAL"])
    pending_obligations = sum(1 for o in obligations if o.status in ["Pending", "In Progress"])
    auto_renewals = sum(1 for c in contracts if c.renewal_type == "auto")

    # 2. Risk Distribution Chart
    risk_dist = {
        "LOW": sum(1 for c in contracts if c.risk_level == "LOW"),
        "MEDIUM": sum(1 for c in contracts if c.risk_level == "MEDIUM"),
        "HIGH": sum(1 for c in contracts if c.risk_level == "HIGH"),
        "CRITICAL": sum(1 for c in contracts if c.risk_level == "CRITICAL")
    }

    # 3. Upcoming Renewals Table
    upcoming_renewals: List[Dict[str, Any]] = []
    for c in contracts:
        ref_date = c.renewal_date or c.end_date
        if ref_date:
            notice_dl = calculate_notice_deadline(ref_date, c.notice_period_days or 30)
            upcoming_renewals.append({
                "id": c.id,
                "contract_name": c.contract_name,
                "contract_type": c.contract_type or "Vendor Agreement",
                "renewal_date": str(ref_date),
                "notice_deadline": str(notice_dl) if notice_dl else str(ref_date),
                "notice_period_days": c.notice_period_days or 30,
                "risk_level": c.risk_level,
                "risk_score": c.risk_score,
                "renewal_type": c.renewal_type or "manual"
            })
    upcoming_renewals.sort(key=lambda x: x["renewal_date"])

    # 4. Action Center Items
    action_items = []
    for c in contracts:
        if c.risk_level in ["HIGH", "CRITICAL"]:
            action_items.append({
                "type": "HIGH_RISK",
                "severity": "CRITICAL" if c.risk_level == "CRITICAL" else "HIGH",
                "title": f"Review High-Risk Terms: {c.contract_name}",
                "description": f"Risk Score {c.risk_score}/100. Contains clauses requiring immediate legal/compliance review.",
                "contract_id": c.id
            })
        if c.renewal_type == "auto" and c.renewal_date:
            days_left = (c.renewal_date - today).days
            if 0 <= days_left <= 60:
                action_items.append({
                    "type": "AUTO_RENEWAL",
                    "severity": "HIGH",
                    "title": f"Auto-Renewal Notice Deadline: {c.contract_name}",
                    "description": f"Contract will automatically renew on {c.renewal_date} unless notice is given.",
                    "contract_id": c.id
                })

    for ob in obligations:
        if ob.status == "Pending" and ob.due_date and ob.due_date <= today:
            action_items.append({
                "type": "OVERDUE_OBLIGATION",
                "severity": "MEDIUM",
                "title": f"Overdue Obligation: {ob.description[:50]}",
                "description": f"Assigned to {ob.responsible_party}. Due date was {ob.due_date}.",
                "contract_id": ob.contract_id
            })

    # 5. Recent Activity
    activity_feed = []
    for a in alerts:
        activity_feed.append({
            "id": a.id,
            "title": a.alert_type.replace('_', ' ').title(),
            "message": a.message,
            "date": str(a.alert_date),
            "status": a.status
        })

    return {
        "kpi": {
            "total_contracts": total_contracts,
            "active_contracts": active_contracts,
            "expiring_soon": expiring_soon,
            "high_risk": high_risk,
            "pending_obligations": pending_obligations,
            "auto_renewals": auto_renewals
        },
        "risk_distribution": risk_dist,
        "upcoming_renewals": upcoming_renewals[:6],
        "action_center": action_items[:5],
        "activity_feed": activity_feed
    }
