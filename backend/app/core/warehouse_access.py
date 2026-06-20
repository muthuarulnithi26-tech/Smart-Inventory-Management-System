from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.warehouse_assignment import WarehouseAssignment


def check_warehouse_access(db: Session, user_id: int, warehouse_id: int, required_roles=None):

    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user_id,
        WarehouseAssignment.warehouse_id == warehouse_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this warehouse"
        )

    if required_roles:
        if assignment.role not in required_roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )

    return assignment