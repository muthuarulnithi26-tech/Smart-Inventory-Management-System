from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.admin import CreateManagerRequest

from app.models.warehouse import Warehouse   # ✅ FIX: missing import

from app.services.admin_service import (
    create_manager,
    get_managers,
    get_staff,
    get_warehouse_users
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ---------------- CREATE MANAGER ----------------
@router.post("/create-manager")
def add_manager(
    data: CreateManagerRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin allowed")

    return create_manager(db, data)
# ---------------- MANAGERS ----------------

@router.get("/managers")
def list_managers(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin allowed")

    return get_managers(db)


# ---------------- STAFF ----------------

@router.get("/staff")
def list_staff(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin allowed")

    return get_staff(db)


# ---------------- WAREHOUSE USERS ----------------

@router.get("/warehouse/{warehouse_id}/users")
def warehouse_users(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin allowed")

    return get_warehouse_users(db, warehouse_id)