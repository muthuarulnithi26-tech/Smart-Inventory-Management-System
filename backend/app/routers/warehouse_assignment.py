from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.warehouse_access import check_warehouse_access

from app.schemas.warehouse_assignment import WarehouseAssignmentCreate

from app.models.user import User
from app.models.warehouse import Warehouse
from app.models.warehouse_assignment import WarehouseAssignment
from app.core.warehouse_access import check_warehouse_access


router = APIRouter(prefix="/assignments", tags=["Warehouse Assignments"])


@router.post("/")
def assign_user(
    data: WarehouseAssignmentCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    # 1️⃣ Only admin can assign users
    check_warehouse_access(db, user.id, data.warehouse_id, required_roles=["admin"])

    # 2️⃣ Check user exists
    target_user = db.query(User).filter(User.id == data.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 3️⃣ Check warehouse exists
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == data.warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    # 4️⃣ Prevent duplicate assignment
    existing = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == data.user_id,
        WarehouseAssignment.warehouse_id == data.warehouse_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already assigned to this warehouse"
        )

    # 5️⃣ Create assignment
    assignment = WarehouseAssignment(
        user_id=data.user_id,
        warehouse_id=data.warehouse_id,
        role=data.role
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "id": assignment.id,
        "user_id": assignment.user_id,
        "warehouse_id": assignment.warehouse_id,
        "role": assignment.role
    }