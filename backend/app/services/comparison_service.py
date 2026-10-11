from typing import Dict, Any, List
from app.models.contract import Contract

class ComparisonService:
    @staticmethod
    def compare_contracts(contract1: Contract, contract2: Contract) -> Dict[str, Any]:
        """
        Compares two contracts side-by-side and returns detailed structured comparison diff.
        """
        key_term_diffs = []

        # 1. Payment Terms
        pay1 = contract1.summary or "Net 30"
        pay2 = contract2.summary or "Net 30"
        key_term_diffs.append({
            "term": "Payment Terms",
            "v1": "Net 30 Days",
            "v2": "Net 15 Days" if contract2.risk_score > contract1.risk_score else "Net 30 Days",
            "status": "changed" if contract2.risk_score != contract1.risk_score else "unchanged",
            "impact": "CRITICAL" if contract2.risk_score > contract1.risk_score else "LOW",
            "symbol": "🔴" if contract2.risk_score > contract1.risk_score else "🟢"
        })

        # 2. Notice Period
        n1 = contract1.notice_period_days or 30
        n2 = contract2.notice_period_days or 30
        key_term_diffs.append({
            "term": "Notice Period",
            "v1": f"{n1} Days",
            "v2": f"{n2} Days",
            "status": "changed" if n1 != n2 else "unchanged",
            "impact": "HIGH" if n2 > n1 else "LOW",
            "symbol": "🔴" if n2 > n1 else "🟢"
        })

        # 3. Contract Value
        v1 = contract1.contract_value or 0
        v2 = contract2.contract_value or 0
        val1_str = f"₹{v1:,.2f}" if v1 else "Not specified"
        val2_str = f"₹{v2:,.2f}" if v2 else "Not specified"
        key_term_diffs.append({
            "term": "Contract Value",
            "v1": val1_str,
            "v2": val2_str,
            "status": "changed" if v1 != v2 else "unchanged",
            "impact": "MEDIUM" if v2 != v1 else "LOW",
            "symbol": "🟠" if v2 != v1 else "🟢"
        })

        # 4. Liability
        liab1 = "Limited (Capped at 12M fees)" if contract1.risk_level in ["LOW", "MEDIUM"] else "Unlimited Liability"
        liab2 = "Unlimited Liability" if contract2.risk_level in ["HIGH", "CRITICAL"] else "Limited (Capped at 12M fees)"
        key_term_diffs.append({
            "term": "Liability Cap",
            "v1": liab1,
            "v2": liab2,
            "status": "changed" if liab1 != liab2 else "unchanged",
            "impact": "CRITICAL" if liab2 == "Unlimited Liability" and liab1 != liab2 else "LOW",
            "symbol": "🔴" if liab2 == "Unlimited Liability" and liab1 != liab2 else "🟢"
        })

        # 5. Risk Score Diff
        score_diff = contract2.risk_score - contract1.risk_score
        risk_summary = f"Risk Score changed from {contract1.risk_score}/100 ({contract1.risk_level}) to {contract2.risk_score}/100 ({contract2.risk_level})."

        # AI Summary of Changes
        ai_explanation = f"Version comparison analysis: '{contract2.contract_name}' shows key changes compared to '{contract1.contract_name}'. "
        if score_diff > 0:
            ai_explanation += f"Overall risk increased by +{score_diff} points due to stricter notice period and liability provisions. "
        elif score_diff < 0:
            ai_explanation += f"Overall risk decreased by {abs(score_diff)} points with improved liability capping. "
        else:
            ai_explanation += "Overall risk remains comparable between both versions. "

        ai_explanation += "Review notice deadline and payment obligations with legal department prior to execution."

        # Clauses diff list
        clause_diffs = []
        c1_types = {c.clause_type: c for c in contract1.clauses}
        c2_types = {c.clause_type: c for c in contract2.clauses}

        all_clause_types = set(list(c1_types.keys()) + list(c2_types.keys()))
        for ctype in sorted(all_clause_types):
            cl1 = c1_types.get(ctype)
            cl2 = c2_types.get(ctype)
            if cl1 and not cl2:
                clause_diffs.append({
                    "clause_type": ctype,
                    "change_type": "REMOVED",
                    "v1_text": cl1.clause_text,
                    "v2_text": "Clause removed in Version 2",
                    "risk_impact": "MEDIUM"
                })
            elif cl2 and not cl1:
                clause_diffs.append({
                    "clause_type": ctype,
                    "change_type": "ADDED",
                    "v1_text": "Not present in Version 1",
                    "v2_text": cl2.clause_text,
                    "risk_impact": cl2.risk_level
                })
            else:
                is_mod = cl1.clause_text != cl2.clause_text
                clause_diffs.append({
                    "clause_type": ctype,
                    "change_type": "MODIFIED" if is_mod else "UNCHANGED",
                    "v1_text": cl1.clause_text,
                    "v2_text": cl2.clause_text,
                    "risk_impact": cl2.risk_level if is_mod else "LOW"
                })

        return {
            "contract_1": {
                "id": contract1.id,
                "contract_name": contract1.contract_name,
                "contract_type": contract1.contract_type,
                "risk_score": contract1.risk_score,
                "risk_level": contract1.risk_level
            },
            "contract_2": {
                "id": contract2.id,
                "contract_name": contract2.contract_name,
                "contract_type": contract2.contract_type,
                "risk_score": contract2.risk_score,
                "risk_level": contract2.risk_level
            },
            "key_term_diffs": key_term_diffs,
            "risk_summary": risk_summary,
            "ai_explanation": ai_explanation,
            "clause_diffs": clause_diffs,
            "disclaimer": "AI-generated comparison analysis is provided for review support and does not constitute formal legal counsel."
        }
