from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.stock_movement import StockMovement
from app.services.inventory_validation import validate_inventory_action


# ---------------- ADD STOCK ----------------

def add_stock(db: Session, warehouse_id: int, product_id: int, quantity: int, user):

    validate_inventory_action(db, user, warehouse_id, product_id)

    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    item = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id,
        Inventory.product_id == product_id
    ).first()

    if item:
        item.quantity += quantity
    else:
        item = Inventory(
            warehouse_id=warehouse_id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(item)

    db.add(
        StockMovement(
            warehouse_id=warehouse_id,
            product_id=product_id,
            user_id=user.id,
            movement_type="IN",
            quantity=quantity
        )
    )

    db.commit()
    db.refresh(item)

    return item


# ---------------- REMOVE STOCK ----------------

def remove_stock(db: Session, warehouse_id: int, product_id: int, quantity: int, user):

    validate_inventory_action(db, user, warehouse_id, product_id)

    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    item = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id,
        Inventory.product_id == product_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Stock not found")

    if item.quantity < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    item.quantity -= quantity

    db.add(
        StockMovement(
            warehouse_id=warehouse_id,
            product_id=product_id,
            user_id=user.id,
            movement_type="OUT",
            quantity=quantity
        )
    )

    db.commit()
    db.refresh(item)

    return item