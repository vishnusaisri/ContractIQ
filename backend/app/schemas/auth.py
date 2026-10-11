from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    company_name: str
    email: str
    password: str
    industry: Optional[str] = "Technology"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    organization_id: str
    name: str
    email: str
    role: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class OrganizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    industry: Optional[str]
    company_size: Optional[str]
    plan: str
    created_at: datetime

class UserInvite(BaseModel):
    name: str
    email: str
    role: str = "member" # owner, admin, legal, manager, member, viewer
