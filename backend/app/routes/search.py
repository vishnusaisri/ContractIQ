from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.contract import SearchQueryRequest
from app.middleware.tenant import get_current_tenant_user
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["Search & Q&A"])

@router.post("/query")
def search_query(
    req: SearchQueryRequest,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    """
    Natural Language search & question answering over organization contracts.
    """
    return SearchService.search_contracts(req.query, current_user.organization_id, db)
