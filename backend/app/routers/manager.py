from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.manager import CreateStaffRequest

from app.services.manager_service import (
    create_staff,
    get_my_staff
)

router = APIRouter(
    prefix="/manager",
    tags=["Manager"]
)

@router.post("/create-staff")
def add_staff(
    data: CreateStaffRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "manager":
        raise HTTPException(
            status_code=403,
            detail="Only manager allowed"
        )

    return create_staff(
        db,
        current_user,
        data.name,
        data.email,
        data.password
    )

@router.get("/staff")
def my_staff(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role != "manager":
        raise HTTPException(
            status_code=403,
            detail="Only manager allowed"
        )

    return get_my_staff(
        db,
        current_user
    )
