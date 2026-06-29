from fastapi import HTTPException
from app.models.product import Product
from app.models.warehouse import Warehouse
from app.core.warehouse_access import check_warehouse_access


def validate_inventory_action(
    db,
    user,
    warehouse_id,
    product_id,
    required_roles
):
    # Check warehouse
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id
    ).first()

    if not warehouse:
        raise HTTPException(
            status_code=404,
            detail="Warehouse not found"
        )

    # Check product
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check warehouse access
    check_warehouse_access(
        db,
        user.id,
        warehouse_id,
        required_roles=required_roles
    )

    return True