from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.warehouse import Warehouse
from app.core.warehouse_access import check_warehouse_access


def validate_inventory_action(
    db: Session,
    user,
    warehouse_id: int,
    product_id: int
) -> bool:
    # ---------------- CHECK WAREHOUSE ----------------

    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found"
        )

    # ---------------- CHECK PRODUCT ----------------

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # ---------------- CHECK ACCESS ----------------

    check_warehouse_access(
        db,
        user.id,
        warehouse_id,
        required_roles=["admin", "manager"]
    )

    return True
