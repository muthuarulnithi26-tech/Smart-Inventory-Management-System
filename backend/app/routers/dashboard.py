from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.dashboard_service import (
    admin_dashboard,
    manager_dashboard,
    staff_dashboard,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can access this dashboard")
    return admin_dashboard(db)


@router.get("/manager")
def get_manager_dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can access this dashboard")
    return manager_dashboard(db, user)


@router.get("/staff")
def get_staff_dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff can access this dashboard")
    return staff_dashboard(db, user)
