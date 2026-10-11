from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.models.user import User
from app.models.organization import Organization
from app.utils.security import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new company user. Automatically creates the Organization and Owner User.
    """
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # 1. Create Organization
    org = Organization(
        name=user_in.company_name,
        industry=user_in.industry or "Technology",
        plan="Starter"
    )
    db.add(org)
    db.flush() # get org.id

    # 2. Create Owner User
    user = User(
        organization_id=org.id,
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role="owner"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Create Access Token
    access_token = create_access_token(data={"sub": user.id, "org_id": org.id, "role": user.role})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        organization_id=org.id,
        name=user.name,
        email=user.email,
        role=user.role
    )

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user and returns JWT token.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated.")

    access_token = create_access_token(data={"sub": user.id, "org_id": user.organization_id, "role": user.role})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        organization_id=user.organization_id,
        name=user.name,
        email=user.email,
        role=user.role
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user details.
    """
    return current_user
