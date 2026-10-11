from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.organization import Organization
from app.schemas.auth import OrganizationResponse, UserResponse, UserInvite
from app.middleware.tenant import get_current_tenant_user
from app.utils.security import hash_password

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/me", response_model=OrganizationResponse)
def get_current_organization(
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found.")
    return org

@router.get("/users", response_model=List[UserResponse])
def list_org_users(
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    return db.query(User).filter(User.organization_id == current_user.organization_id).all()

@router.post("/users/invite", response_model=UserResponse)
def invite_user(
    invite_in: UserInvite,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Only Owners and Admins can invite team members.")

    existing = db.query(User).filter(User.email == invite_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    temp_password = "ContractIQTempPass123!"
    new_user = User(
        organization_id=current_user.organization_id,
        name=invite_in.name,
        email=invite_in.email,
        password_hash=hash_password(temp_password),
        role=invite_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.delete("/users/{user_id}", status_code=204)
def remove_user(
    user_id: str,
    current_user: User = Depends(get_current_tenant_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Only Owners and Admins can remove users.")

    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself.")

    target_user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found in organization.")

    db.delete(target_user)
    db.commit()
