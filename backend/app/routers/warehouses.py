from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.core.warehouse_access import check_warehouse_access

from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseUpdate,
    WarehouseResponse
)

from app.services import warehouse_service

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


# ---------------- CREATE WAREHOUSE ----------------

@router.post("/", response_model=WarehouseResponse)
def create_warehouse(
    data: WarehouseCreate,
    db: Session = Depends(get_db),
   user = Depends(get_current_user)
):
    return warehouse_service.create_warehouse(db, data,user)


# ---------------- GET ALL ----------------

@router.get("/", response_model=list[WarehouseResponse])
def get_warehouses(
    db: Session = Depends(get_db),
   user = Depends(get_current_user)
):
    return warehouse_service.get_warehouses(db)


# ---------------- GET BY ID ----------------
@router.get("/{warehouse_id}")
def get_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return warehouse_service.get_warehouse(
        db,
        warehouse_id,
        user
    )

# ---------------- UPDATE ----------------
@router.put("/{warehouse_id}")
def update_warehouse(
    warehouse_id: int,
    data: WarehouseUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return warehouse_service.update_warehouse(
        db,
        warehouse_id,
        data,
        user
    )
# ---------------- DELETE ----------------
@router.delete("/{warehouse_id}")
def delete_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return warehouse_service.delete_warehouse(
        db,
        warehouse_id,
        user
    )
