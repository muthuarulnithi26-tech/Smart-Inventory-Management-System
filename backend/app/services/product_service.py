from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.product import Product

from app.models.product import Product
from app.models.warehouse_assignment import WarehouseAssignment



# ---------------- CREATE PRODUCT ----------------

def get_user_warehouse(db: Session, user):

    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user.id
    ).first()

    if not assignment:
        raise HTTPException(400, "No warehouse assigned")

    return assignment.warehouse_id


def create_product(db: Session, data, current_user):

    warehouse_id = get_user_warehouse(db, current_user)

    product = Product(
        name=data.name,
        sku=data.sku,
        unit=data.unit,
        purchase_price=data.purchase_price,
        selling_price=data.selling_price,
        warehouse_id=warehouse_id
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product
# ---------------- GET ALL PRODUCTS ----------------
def get_products(db: Session, current_user):

    query = db.query(Product)

    if current_user.role == "admin":
        return query.all()

    warehouse_id = get_user_warehouse(db, current_user)

    return query.filter(
        Product.warehouse_id == warehouse_id
    ).all()
# ---------------- GET SINGLE PRODUCT ----------------

def get_product(db: Session, product_id: int):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# ---------------- UPDATE PRODUCT ----------------

def update_product(db: Session, product_id: int, data):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # SKU check (important)
    if data.sku and data.sku != product.sku:
        existing = db.query(Product).filter(
            Product.sku == data.sku
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="SKU already exists")

    if data.name is not None:
        product.name = data.name

    if data.sku is not None:
        product.sku = data.sku

    if data.unit is not None:
        product.unit = data.unit

    if data.purchase_price is not None:
        product.purchase_price = data.purchase_price

    if data.selling_price is not None:
        product.selling_price = data.selling_price

    db.commit()
    db.refresh(product)

    return product


# ---------------- DELETE PRODUCT ----------------

def delete_product(db: Session, product_id: int):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}
