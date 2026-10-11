from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.clause import Clause
from app.models.obligation import Obligation
from app.models.alert import Alert
from app.middleware.tenant import get_current_tenant_user

router = APIRouter(prefix="/demo", tags=["Demo & Seed Data"])

@router.post("/seed", status_code=status.HTTP_201_CREATED)
def seed_demo_contracts(
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Seeds realistic production sample contracts into the user's organization for instant demonstration.
    """
    org_id = current_user.organization_id
    today = date.today()

    # Clear existing demo contracts if re-seeding
    existing = db.query(Contract).filter(Contract.organization_id == org_id).all()
    if existing:
        return {"message": "Organization already has contracts populated.", "count": len(existing)}

    samples = [
        {
            "name": "Acme Cloud Infrastructure MSA",
            "type": "Master Services Agreement",
            "file_name": "Acme_Cloud_MSA_2026.pdf",
            "status": "COMPLETED",
            "start": today - timedelta(days=300),
            "end": today + timedelta(days=65),
            "renewal": today + timedelta(days=65),
            "renewal_type": "auto",
            "notice_days": 60,
            "value": 1500000.0,
            "currency": "INR",
            "risk_score": 75,
            "risk_level": "HIGH",
            "summary": "Master Services Agreement with Acme Cloud for multi-region hosting. Contains automatic 1-year renewal with 60-day cancellation notice requirement and unlimited liability clause for data breaches.",
            "clauses": [
                {
                    "type": "liability",
                    "text": "Neither party's liability under this agreement shall be capped or limited for any direct, indirect, special, or consequential damages resulting from service downtime.",
                    "page": 5,
                    "level": "CRITICAL",
                    "exp": "Explicit unlimited liability clause without financial cap (+25 Risk)."
                },
                {
                    "type": "renewal",
                    "text": "Agreement automatically renews for successive 12-month periods unless written notice of non-renewal is received 60 days prior to expiry.",
                    "page": 2,
                    "level": "HIGH",
                    "exp": "Auto-renewal clause with 60-day advance notice deadline (+15 Risk)."
                }
            ],
            "obligations": [
                {
                    "party": "Acme Cloud",
                    "desc": "Provide 99.9% uptime SLA report and monthly infrastructure metrics.",
                    "due": today + timedelta(days=15),
                    "freq": "Monthly",
                    "priority": "High"
                },
                {
                    "party": "Company Legal Team",
                    "desc": "Submit non-renewal cancellation letter to Acme prior to 60-day deadline.",
                    "due": today + timedelta(days=5),
                    "freq": "One-time",
                    "priority": "Critical"
                }
            ]
        },
        {
            "name": "Global Logistics Supply Chain Agreement",
            "type": "Vendor Agreement",
            "file_name": "Global_Logistics_Vendor_Contract.pdf",
            "status": "COMPLETED",
            "start": today - timedelta(days=180),
            "end": today + timedelta(days=185),
            "renewal": today + timedelta(days=185),
            "renewal_type": "auto",
            "notice_days": 90,
            "value": 4200000.0,
            "currency": "INR",
            "risk_score": 85,
            "risk_level": "CRITICAL",
            "summary": "Nationwide logistics supply chain agreement. Includes broad indemnification obligations, 90-day notice requirement, and strict liquidated damages penalties for late shipments.",
            "clauses": [
                {
                    "type": "indemnification",
                    "text": "Vendor agrees to defend, indemnify, and hold harmless Client from any third-party claims, liabilities, losses, or costs arising out of performance of logistics services.",
                    "page": 7,
                    "level": "HIGH",
                    "exp": "Broad indemnification clause covering third-party claims (+20 Risk)."
                },
                {
                    "type": "penalty",
                    "text": "Liquidated damages of ₹50,000 per day shall apply for shipment delays exceeding 48 hours.",
                    "page": 4,
                    "level": "HIGH",
                    "exp": "Liquidated damages and financial penalties (+10 Risk)."
                }
            ],
            "obligations": [
                {
                    "party": "Logistics Partner",
                    "desc": "Deliver monthly fleet maintenance and insurance validation certificate.",
                    "due": today + timedelta(days=20),
                    "freq": "Monthly",
                    "priority": "Medium"
                }
            ]
        },
        {
            "name": "Enterprise CRM Software Subscription",
            "type": "SaaS Subscription Agreement",
            "file_name": "Enterprise_CRM_SaaS_License.pdf",
            "status": "COMPLETED",
            "start": today - timedelta(days=90),
            "end": today + timedelta(days=275),
            "renewal": today + timedelta(days=275),
            "renewal_type": "manual",
            "notice_days": 30,
            "value": 850000.0,
            "currency": "INR",
            "risk_score": 20,
            "risk_level": "LOW",
            "summary": "Standard enterprise SaaS user license agreement for sales CRM platform. Liability limited to fees paid in preceding 12 months with Net 30 payment terms.",
            "clauses": [
                {
                    "type": "payment",
                    "text": "Invoices payable within Net 30 days of invoice issue date.",
                    "page": 2,
                    "level": "LOW",
                    "exp": "Standard Net 30 payment terms."
                },
                {
                    "type": "liability",
                    "text": "Maximum aggregate liability limited to total fees paid during preceding 12-month contract period.",
                    "page": 4,
                    "level": "LOW",
                    "exp": "Standard capped liability."
                }
            ],
            "obligations": [
                {
                    "party": "IT Administrator",
                    "desc": "Review user seat allocation and deactivate inactive account credentials.",
                    "due": today + timedelta(days=30),
                    "freq": "Quarterly",
                    "priority": "Low"
                }
            ]
        },
        {
            "name": "Senior Software Architect Employment Contract",
            "type": "Employment Agreement",
            "file_name": "Employment_Agreement_Architect.pdf",
            "status": "COMPLETED",
            "start": today - timedelta(days=120),
            "end": None,
            "renewal": None,
            "renewal_type": "none",
            "notice_days": 60,
            "value": 2800000.0,
            "currency": "INR",
            "risk_score": 15,
            "risk_level": "LOW",
            "summary": "Full-time executive employment agreement including intellectual property assignment, confidentiality provisions, and 60-day notice period.",
            "clauses": [
                {
                    "type": "intellectual_property",
                    "text": "All inventions, code, designs, and patents created during employment belong exclusively to Company.",
                    "page": 3,
                    "level": "LOW",
                    "exp": "Standard IP assignment clause."
                }
            ],
            "obligations": [
                {
                    "party": "HR Department",
                    "desc": "Conduct annual performance review and bonus eligibility evaluation.",
                    "due": today + timedelta(days=240),
                    "freq": "Annual",
                    "priority": "Medium"
                }
            ]
        },
        {
            "name": "Bilateral Non-Disclosure Agreement",
            "type": "Non-Disclosure Agreement",
            "file_name": "Mutual_NDA_Partner_2026.pdf",
            "status": "COMPLETED",
            "start": today - timedelta(days=40),
            "end": today + timedelta(days=1050),
            "renewal": None,
            "renewal_type": "none",
            "notice_days": 30,
            "value": 0.0,
            "currency": "INR",
            "risk_score": 10,
            "risk_level": "LOW",
            "summary": "Mutual non-disclosure agreement governing confidential strategic discussions with prospective technology integration partner. Standard 3-year term.",
            "clauses": [
                {
                    "type": "confidentiality",
                    "text": "Both parties agree to maintain strict confidentiality of disclosed proprietary materials for a period of 3 years.",
                    "page": 1,
                    "level": "LOW",
                    "exp": "Standard 3-year mutual confidentiality protection."
                }
            ],
            "obligations": []
        }
    ]

    created_contracts = []
    for s in samples:
        c = Contract(
            organization_id=org_id,
            uploaded_by=current_user.id,
            contract_name=s["name"],
            contract_type=s["type"],
            file_name=s["file_name"],
            file_url=f"./uploaded_contracts/{s['file_name']}",
            status=s["status"],
            start_date=s["start"],
            end_date=s["end"],
            renewal_date=s["renewal"],
            renewal_type=s["renewal_type"],
            notice_period_days=s["notice_days"],
            contract_value=s["value"],
            currency=s["currency"],
            risk_score=s["risk_score"],
            risk_level=s["risk_level"],
            summary=s["summary"],
            raw_text=s["summary"]
        )
        db.add(c)
        db.flush()

        for cl in s["clauses"]:
            db.add(Clause(
                contract_id=c.id,
                clause_type=cl["type"],
                clause_text=cl["text"],
                page_number=cl["page"],
                risk_level=cl["level"],
                risk_score=25 if cl["level"] == "CRITICAL" else (15 if cl["level"] == "HIGH" else 0),
                explanation=cl["exp"]
            ))

        for ob in s["obligations"]:
            db.add(Obligation(
                contract_id=c.id,
                responsible_party=ob["party"],
                description=ob["desc"],
                due_date=ob["due"],
                frequency=ob["freq"],
                status="Pending",
                priority=ob["priority"]
            ))

        # Add initial alert for high risk sample
        if c.risk_level in ["HIGH", "CRITICAL"]:
            db.add(Alert(
                organization_id=org_id,
                contract_id=c.id,
                alert_type="high_risk",
                alert_date=today,
                message=f"High Risk Alert ({c.risk_score}/100): '{c.contract_name}' contains critical liability & renewal terms.",
                status="unread"
            ))

        created_contracts.append(c.id)

    db.commit()
    return {"message": "Demo sample contracts seeded successfully!", "count": len(created_contracts)}
