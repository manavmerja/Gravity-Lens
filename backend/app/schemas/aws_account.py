from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

# ─────────────────────────────────────────
# REQUEST SCHEMAS (What frontend sends)
# ─────────────────────────────────────────

class ConnectAwsRequest(BaseModel):
    role_arn: str           # arn:aws:iam::123456789012:role/GravityLensRole
    account_name: Optional[str] = None

class CreateUserRequest(BaseModel):
    email: str
    name: Optional[str] = None
    auth0_id: Optional[str] = None

# ─────────────────────────────────────────
# RESPONSE SCHEMAS (What backend returns)
# ─────────────────────────────────────────

class AwsAccountResponse(BaseModel):
    id: UUID
    account_id: str
    account_name: Optional[str]
    role_arn: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConnectAwsResponse(BaseModel):
    success: bool
    message: str
    account: Optional[AwsAccountResponse] = None