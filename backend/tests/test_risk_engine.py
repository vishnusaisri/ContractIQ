import pytest
from app.services.risk_engine import RiskEngine

def test_risk_engine_rules():
    sample_analysis = {
        "contract_type": "Vendor Agreement",
        "renewal": {
            "type": "auto",
            "notice_period_days": 95
        },
        "payment_terms": "Advance 100%",
        "clauses": [
            {
                "clause_type": "liability",
                "clause_text": "Unlimited liability clause",
                "risk_level": "CRITICAL"
            },
            {
                "clause_type": "indemnification",
                "clause_text": "Indemnify and hold harmless client against all losses",
                "risk_level": "HIGH"
            }
        ]
    }

    raw_text = "This vendor agreement includes unlimited liability and broad indemnity."
    score, level, breakdown = RiskEngine.calculate_risk(sample_analysis, raw_text)

    # +25 unlimited liability, +20 broad indemnification, +15 auto-renewal, +15 notice > 90d, +15 missing SLA, +5 advance payment
    assert score >= 75
    assert level in ["HIGH", "CRITICAL"]
    assert len(breakdown) >= 4
