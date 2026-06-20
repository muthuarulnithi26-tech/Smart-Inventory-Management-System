from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.warehouse import Warehouse
from app.core.warehouse_access import check_warehouse_access

def create_warehouse(db: Session, data, user):
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

def get_all_warehouses(db: Session):
    return db.query(Warehouse).all()


def get_warehouse(db: Session, warehouse_id: int, user):

    check_warehouse_access(db, user.id, warehouse_id)

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Not found")

    return warehouse

def update_warehouse(db: Session, warehouse_id: int, data, user):

    check_warehouse_access(
        db,
        user.id,
        warehouse_id,
        required_roles=["admin", "manager"]
    )

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Not found")

    warehouse.name = data.name
    warehouse.location = data.location
    warehouse.capacity = data.capacity

    db.commit()
    db.refresh(warehouse)

    return warehouse


def delete_warehouse(db: Session, warehouse_id: int, user):

    check_warehouse_access(
        db,
        user.id,
        warehouse_id,
        required_roles=["admin"]
    )

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(warehouse)
    db.commit()

    return {"message": "Warehouse deleted"}

