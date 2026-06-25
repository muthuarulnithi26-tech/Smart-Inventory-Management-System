from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.services.shipment_service import (
    create_shipment,
    update_shipment_status
)

router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("/")
def create(
    order_id: int,
    vehicle_type: str,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return create_shipment(db, user, order_id, vehicle_type)


@router.put("/{shipment_id}")
def update_status(
    shipment_id: int,
    status: str,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return update_shipment_status(db, user, shipment_id, status)
