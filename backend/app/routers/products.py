from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.core.database import get_db

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

from app.services import product_service


router = APIRouter(prefix="/products", tags=["Products"])


# ---------------- CREATE PRODUCT ----------------
@router.post("/products")
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return product_service.create_product(db, data, current_user)

# ---------------- GET ALL PRODUCTS ----------------
@router.get("/products")
def get_products(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return product_service.get_products(db, current_user)
# ---------------- UPDATE PRODUCT ----------------

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db)
):
    return product_service.update_product(db, product_id, data)


# ---------------- DELETE PRODUCT ----------------

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return product_service.delete_product(db, product_id)
