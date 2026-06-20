from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.schemas.inventory import InventoryCreate
from app.services import inventory_service


router = APIRouter(prefix="/stock", tags=["Stock"])


# ---------------- ADD STOCK ----------------

@router.post("/add")
def add_stock(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return inventory_service.add_stock(
        db,
        data.warehouse_id,
        data.product_id,
        data.quantity,
        user
    )


# ---------------- REMOVE STOCK ----------------

@router.post("/remove")
def remove_stock(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return inventory_service.remove_stock(
        db,
        data.warehouse_id,
        data.product_id,
        data.quantity,
        user
    )


# ---------------- GET INVENTORY BY WAREHOUSE ----------------

@router.get("/{warehouse_id}")
def get_inventory(
    warehouse_id: int,
    db: Session = Depends(get_db)
):
    return inventory_service.get_inventory(db, warehouse_id)
