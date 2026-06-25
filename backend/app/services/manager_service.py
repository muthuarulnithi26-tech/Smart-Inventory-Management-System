from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.warehouse_assignment import WarehouseAssignment
from app.core.security import hash_password
from app.services.warehouse_assignment_service import get_warehouse_users


def create_staff(
    db: Session,
    manager,
    name: str,
    email: str,
    password: str
):

    existing = db.query(User).filter(
        User.email == email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    manager_assignment = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.user_id == manager.id,
        WarehouseAssignment.role == "manager"
    ).first()

    if not manager_assignment:
        raise HTTPException(
            status_code=400,
            detail="Manager warehouse not found"
        )

    staff = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role="staff"
    )

    db.add(staff)
    db.commit()
    db.refresh(staff)

    db.add(
        WarehouseAssignment(
            user_id=staff.id,
            warehouse_id=manager_assignment.warehouse_id,
            role="staff"
        )
    )

    db.commit()

    return {
        "message": "Staff created"
    }

def get_my_staff(
    db,
    manager
):

    manager_assignment = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.user_id == manager.id,
        WarehouseAssignment.role == "manager"
    ).first()

    if not manager_assignment:
        raise HTTPException(
            status_code=404,
            detail="Manager warehouse not found"
        )

    staff_assignments = db.query(
        WarehouseAssignment
    ).filter(
        WarehouseAssignment.warehouse_id
        == manager_assignment.warehouse_id,

        WarehouseAssignment.role == "staff"
    ).all()

    result = []

    for assignment in staff_assignments:

        user = db.query(User).filter(
            User.id == assignment.user_id
        ).first()

        if user:
            result.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": "staff",
                "warehouse_id": assignment.warehouse_id
            })

    return result