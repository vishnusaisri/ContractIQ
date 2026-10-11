from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.models.clause import Clause
from app.models.obligation import Obligation

class SearchService:
    @staticmethod
    def search_contracts(query: str, organization_id: str, db: Session) -> Dict[str, Any]:
        """
        Natural language contract search and question answering service.
        Query examples:
        - "Which contracts expire in the next 60 days?"
        - "Which contracts automatically renew?"
        - "Show contracts with unlimited liability."
        - "Which vendors have late-delivery penalties?"
        - "What are the highest-risk contracts?"
        """
        q = query.lower().strip()
        all_contracts = db.query(Contract).filter(Contract.organization_id == organization_id).all()

        matching_contracts = []
        answer = ""

        # Pattern 1: High risk query
        if "risk" in q or "dangerous" in q or "critical" in q:
            matches = [c for c in all_contracts if c.risk_level in ["HIGH", "CRITICAL"] or c.risk_score >= 50]
            matches.sort(key=lambda x: x.risk_score, reverse=True)
            matching_contracts = matches
            if matches:
                names = ", ".join([c.contract_name for c in matches[:3]])
                answer = f"Found {len(matches)} high-risk contracts. Highest risk: {names}."
            else:
                answer = "No high-risk contracts found in your organization."

        # Pattern 2: Auto-renewal query
        elif "renew" in q or "auto" in q:
            matches = [c for c in all_contracts if c.renewal_type == "auto" or "auto" in (c.summary or "").lower()]
            matching_contracts = matches
            if matches:
                answer = f"Found {len(matches)} contract(s) with auto-renewal clauses active."
            else:
                answer = "No auto-renewing contracts were found."

        # Pattern 3: Expiration / Deadlines
        elif "expire" in q or "expiration" in q or "deadline" in q:
            matches = [c for c in all_contracts if c.end_date or c.renewal_date]
            matching_contracts = matches
            if matches:
                answer = f"Found {len(matches)} contract(s) with tracked expiration or renewal dates."
            else:
                answer = "No contract expiration dates matching your query."

        # Pattern 4: Unlimited liability
        elif "liability" in q or "unlimited" in q:
            matches = [c for c in all_contracts if c.risk_score >= 50 or "liability" in (c.summary or "").lower()]
            matching_contracts = matches
            if matches:
                answer = f"Found {len(matches)} contract(s) containing liability clauses requiring legal review."
            else:
                answer = "No contracts with unlimited liability detected."

        # Generic keyword search fallback across name, summary, contract type
        else:
            keywords = [w for w in q.split() if len(w) > 2]
            matches = []
            for c in all_contracts:
                text_to_check = f"{c.contract_name} {c.contract_type} {c.summary} {c.raw_text}".lower()
                if any(kw in text_to_check for kw in keywords):
                    matches.append(c)
            matching_contracts = matches
            if matches:
                answer = f"Found {len(matches)} contract(s) matching '{query}'."
            else:
                answer = f"No contract data explicitly matched '{query}'. Please verify contract terms or upload additional documents."

        results = []
        for c in matching_contracts[:10]: # Return top 10 matches
            results.append({
                "id": c.id,
                "contract_name": c.contract_name,
                "contract_type": c.contract_type,
                "risk_level": c.risk_level,
                "risk_score": c.risk_score,
                "renewal_date": str(c.renewal_date) if c.renewal_date else None,
                "end_date": str(c.end_date) if c.end_date else None,
                "summary": c.summary[:200] + "..." if c.summary and len(c.summary) > 200 else c.summary
            })

        return {
            "query": query,
            "answer": answer,
            "matching_count": len(matching_contracts),
            "results": results,
            "disclaimer": "AI-generated search responses are derived from extracted contract text and for review purposes only."
        }
