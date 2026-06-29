from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.stock_movement import StockMovement
from app.models.product import Product
from app.services.inventory_validation import validate_inventory_action


# ---------------- ADD STOCK ----------------

def add_stock(db: Session, warehouse_id: int, product_id: int, quantity: int, user):

    # validate_inventory_action(db, user, warehouse_id, product_id)
    validate_inventory_action(
    db,
    user,
    warehouse_id,
    product_id,
    ["admin", "manager", "staff"]
)
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    existing = db.query(Inventory).filter_by(
        warehouse_id=warehouse_id,
        product_id=product_id
    ).first()

    if existing:
        existing.quantity += quantity
    else:
        existing = Inventory(
            warehouse_id=warehouse_id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(existing)

    db.add(StockMovement(
        warehouse_id=warehouse_id,
        product_id=product_id,
        user_id=user.id,
        movement_type="IN",
        quantity=quantity
    ))

    db.commit()
    db.refresh(existing)

    return existing


# ---------------- REMOVE STOCK ----------------

def remove_stock(db: Session, warehouse_id: int, product_id: int, quantity: int, user):

    # validate_inventory_action(db, user, warehouse_id, product_id)
    validate_inventory_action(
    db,
    user,
    warehouse_id,
    product_id,
    ["admin", "manager"]
)
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    existing = db.query(Inventory).filter_by(
        warehouse_id=warehouse_id,
        product_id=product_id
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Stock not found")

    # 🔥 IMPORTANT RULE
    if existing.quantity < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    existing.quantity -= quantity

    db.add(StockMovement(
        warehouse_id=warehouse_id,
        product_id=product_id,
        user_id=user.id,
        movement_type="OUT",
        quantity=quantity
    ))

    db.commit()
    db.refresh(existing)

    return existing


# ---------------- GET INVENTORY ----------------

def get_inventory(db: Session, warehouse_id: int):

    items = db.query(Inventory).filter(
        Inventory.warehouse_id == warehouse_id
    ).all()

    result = []

    for item in items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        result.append({
            "id": item.id,
            "warehouse_id": item.warehouse_id,
            "product_id": item.product_id,
            "product_name": product.name if product else None,
            "quantity": item.quantity
        })

    return result
