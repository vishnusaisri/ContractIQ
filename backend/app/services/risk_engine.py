from typing import Dict, Any, List, Tuple

class RiskEngine:
    """
    Transparent, deterministic rule-based risk calculation engine for contracts.
    Never relies on AI for risk score arithmetic.
    """

    @staticmethod
    def calculate_risk(analysis_data: Dict[str, Any], raw_text: str = "") -> Tuple[int, str, List[Dict[str, Any]]]:
        """
        Calculates total risk score (0-100), risk level (LOW, MEDIUM, HIGH, CRITICAL),
        and explicit score breakdown list explaining every point added.
        """
        score = 0
        breakdown: List[Dict[str, Any]] = []

        text_lower = (raw_text + " " + json_to_searchable_string(analysis_data)).lower()
        
        # Rule 1: Unlimited Liability (+25)
        liability_clauses = [c for c in analysis_data.get("clauses", []) if c.get("clause_type") == "liability"]
        has_unlimited_liab = any("unlimited" in c.get("clause_text", "").lower() or c.get("risk_level") == "CRITICAL" for c in liability_clauses)
        if has_unlimited_liab or "unlimited liability" in text_lower or "shall not be limited" in text_lower:
            score += 25
            breakdown.append({
                "rule": "Unlimited Liability",
                "points": 25,
                "reason": "Contract contains unlimited financial liability exposure or uncapped liability clause."
            })

        # Rule 2: Broad Indemnification (+20)
        indem_clauses = [c for c in analysis_data.get("clauses", []) if c.get("clause_type") in ["indemnification", "indemnity"]]
        has_broad_indem = any(c.get("risk_level") in ["HIGH", "CRITICAL"] for c in indem_clauses)
        if has_broad_indem or "indemnify and hold harmless" in text_lower or "broad indemnity" in text_lower:
            score += 20
            breakdown.append({
                "rule": "Broad Indemnification",
                "points": 20,
                "reason": "Contract contains broad, one-sided indemnification obligation covering third-party claims."
            })

        # Rule 3: Auto-Renewal Clause (+15)
        renewal_info = analysis_data.get("renewal", {})
        renewal_type = str(renewal_info.get("type", "")).lower()
        if renewal_type == "auto" or "auto-renew" in text_lower or "automatically renew" in text_lower:
            score += 15
            breakdown.append({
                "rule": "Auto-Renewal Clause",
                "points": 15,
                "reason": "Contract automatically renews for another term unless explicit advance notice is given."
            })

        # Rule 4: Long Notice Period > 90 days (+15) or > 60 days (+10)
        notice_days = renewal_info.get("notice_period_days") or 0
        if notice_days > 90 or "120 days notice" in text_lower or "90 days notice" in text_lower:
            score += 15
            breakdown.append({
                "rule": "Notice Period > 90 Days",
                "points": 15,
                "reason": f"Notice period requirement is unusually long ({notice_days} days)."
            })
        elif notice_days > 60:
            score += 10
            breakdown.append({
                "rule": "Notice Period > 60 Days",
                "points": 10,
                "reason": f"Notice period requirement is longer than standard 30 days ({notice_days} days)."
            })

        # Rule 5: Missing SLA / Service Level Agreement (+15)
        contract_type = str(analysis_data.get("contract_type", "")).lower()
        if ("saas" in contract_type or "service" in contract_type or "vendor" in contract_type) and ("service level" not in text_lower and "sla" not in text_lower):
            score += 15
            breakdown.append({
                "rule": "Missing SLA",
                "points": 15,
                "reason": "Service/SaaS contract does not define explicit Service Level Agreements or uptime guarantees."
            })

        # Rule 6: High Termination Penalty (+10)
        term_clauses = [c for c in analysis_data.get("clauses", []) if c.get("clause_type") == "termination"]
        if any("penalty" in c.get("clause_text", "").lower() or "cancellation fee" in c.get("clause_text", "").lower() for c in term_clauses) or "termination fee" in text_lower:
            score += 10
            breakdown.append({
                "rule": "High Termination Penalty",
                "points": 10,
                "reason": "Contract imposes financial penalty or early cancellation fees upon termination."
            })

        # Rule 7: High Financial Penalty / Liquidated Damages (+10)
        if "liquidated damages" in text_lower or "financial penalty" in text_lower:
            score += 10
            breakdown.append({
                "rule": "High Financial Penalty",
                "points": 10,
                "reason": "Contract specifies liquidated damages or financial penalty clauses for delay or non-performance."
            })

        # Rule 8: Unusual Payment Terms (+5)
        pay_terms = str(analysis_data.get("payment_terms", "")).lower()
        if "advance" in pay_terms or "upfront" in pay_terms or "net 90" in pay_terms or "net 120" in pay_terms:
            score += 5
            breakdown.append({
                "rule": "Unusual Payment Terms",
                "points": 5,
                "reason": f"Payment terms require advance upfront payment or long payment window ({analysis_data.get('payment_terms')})."
            })

        # Cap max score at 100
        score = min(100, max(0, score))

        # Determine Risk Level Category
        if score <= 25:
            level = "LOW"
        elif score <= 50:
            level = "MEDIUM"
        elif score <= 75:
            level = "HIGH"
        else:
            level = "CRITICAL"

        return score, level, breakdown

def json_to_searchable_string(d: Any) -> str:
    if isinstance(d, dict):
        return " ".join(json_to_searchable_string(v) for v in d.values())
    elif isinstance(d, list):
        return " ".join(json_to_searchable_string(item) for item in d)
    return str(d)
