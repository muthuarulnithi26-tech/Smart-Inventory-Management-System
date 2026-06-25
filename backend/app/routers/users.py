from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.user import UserCreate
from app.services.user_service import (
    create_user,
    get_users,
    get_user_by_id,
    delete_user
)

router = APIRouter(prefix="/users", tags=["Users"])


# CREATE USER (ADMIN or MANAGER ONLY CONTROLLED IN FRONTEND/BACKEND LATER)
@router.post("/")
def create(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(
        db,
        data.name,
        data.email,
        data.password,
        data.role
    )


@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return get_users(db)


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, user_id)


@router.delete("/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    return delete_user(db, user_id)
