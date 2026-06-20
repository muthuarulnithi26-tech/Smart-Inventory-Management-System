from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product


# ---------------- CREATE PRODUCT ----------------

def create_product(db: Session, data):
    existing = db.query(Product).filter(
        Product.sku == data.sku
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")

    product = Product(
    name=data.name,
    sku=data.sku,
    unit=data.unit,

    purchase_price=data.purchase_price,

    selling_price=data.selling_price
)

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


# ---------------- GET ALL PRODUCTS ----------------

def get_products(db: Session):
    return db.query(Product).all()


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
