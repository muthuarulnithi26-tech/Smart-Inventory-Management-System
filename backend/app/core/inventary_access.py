from fastapi import HTTPException
from app.models.warehouse_assignment import WarehouseAssignment


def check_inventory_access(db, user_id, warehouse_id):

    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user_id,
        WarehouseAssignment.warehouse_id == warehouse_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=403, detail="No warehouse access")

    if assignment.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not allowed to modify inventory")

    return assignment
