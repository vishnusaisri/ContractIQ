from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.contract import Contract

class NotificationService:
    @staticmethod
    def generate_contract_alerts(contract: Contract, db: Session):
        """
        Generates automated alerts for upcoming deadlines, auto-renewals, and high-risk contracts.
        """
        today = date.today()
        
        # High Risk Alert
        if contract.risk_level in ["HIGH", "CRITICAL"]:
            existing = db.query(Alert).filter(
                Alert.contract_id == contract.id,
                Alert.alert_type == "high_risk"
            ).first()
            if not existing:
                alert = Alert(
                    organization_id=contract.organization_id,
                    contract_id=contract.id,
                    alert_type="high_risk",
                    alert_date=today,
                    message=f"High Risk Alert ({contract.risk_score}/100): '{contract.contract_name}' contains critical risk clauses requiring legal review.",
                    status="unread"
                )
                db.add(alert)

        # Renewal & Expiration Alert
        ref_date = contract.renewal_date or contract.end_date
        if ref_date:
            days_remaining = (ref_date - today).days
            if 0 <= days_remaining <= 90:
                existing_renewal = db.query(Alert).filter(
                    Alert.contract_id == contract.id,
                    Alert.alert_type == "renewal"
                ).first()
                if not existing_renewal:
                    alert = Alert(
                        organization_id=contract.organization_id,
                        contract_id=contract.id,
                        alert_type="renewal",
                        alert_date=today,
                        message=f"Renewal Deadline Approaching ({days_remaining} days): '{contract.contract_name}' renewal/expiry date is {ref_date}.",
                        status="unread"
                    )
                    db.add(alert)

        db.commit()
