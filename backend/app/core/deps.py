from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    # print("TOKEN:", token)

    payload = decode_access_token(token)

    # print("PAYLOAD:", payload)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    email = payload.get("sub")

    # print("EMAIL:", email)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    # print("USER:", user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # print("ROLE:", user.role)

    return user
def require_user(user: User):
    if not user:
        raise HTTPException(401, "Unauthorized")
    return user
def require_role(user: User, roles: list):
    if user.role not in roles:
        raise HTTPException(403, "Forbidden")
    return user
def require_warehouse(user: User):
    if user.role != "admin" and not user.warehouse_id:
        raise HTTPException(400, "No warehouse assigned")
    return user
