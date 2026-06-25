from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.warehouse import Warehouse

from app.core.warehouse_access import (
    check_warehouse_access
)


# ---------------- CREATE WAREHOUSE ----------------

def create_warehouse(
    db: Session,
    data,
    user
):
    warehouse = Warehouse(
        name=data.name,
        location=data.location,
        capacity=data.capacity,
        created_by=user.id
    )

    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)

    return warehouse


# ---------------- GET ALL ACTIVE WAREHOUSES ----------------

def get_warehouses(
    db: Session
):
    return db.query(Warehouse).filter(
        Warehouse.is_active == True
    ).all()


# ---------------- GET WAREHOUSE ----------------

def get_warehouse(
    db: Session,
    warehouse_id: int,
    user
):
    check_warehouse_access(
        db,
        user.id,
        warehouse_id
    )

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found"
        )

    return warehouse


# ---------------- UPDATE WAREHOUSE ----------------

def update_warehouse(
    db: Session,
    warehouse_id: int,
    data,
    user
):
    check_warehouse_access(
        db,
        user.id,
        warehouse_id,
        required_roles=[
            "admin",
            "manager"
        ]
    )

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found"
        )

    warehouse.name = data.name
    warehouse.location = data.location
    warehouse.capacity = data.capacity

    db.commit()
    db.refresh(warehouse)

    return warehouse


# ---------------- SOFT DELETE WAREHOUSE ----------------

def delete_warehouse(
    db: Session,
    warehouse_id: int,
    user
):
    warehouse = get_warehouse(
        db,
        warehouse_id,
        user
    )

    warehouse.is_active = False

    db.commit()
    db.refresh(warehouse)

    return {
        "message": "Warehouse deactivated successfully"
    }
