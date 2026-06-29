from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.shipment import ShipmentCreate

from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.shipment_service import (
    create_shipment,
    update_shipment_status,
    get_shipments
)

router = APIRouter(prefix="/shipments", tags=["Shipments"])

@router.post("/")
def create(
    shipment: ShipmentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return create_shipment(
        db=db,
        user=user,
        order_id=shipment.order_id,
        vehicle_type=shipment.vehicle_type,
        vehicle_number=shipment.vehicle_number,
        driver_name=shipment.driver_name,
    )

# GET SHIPMENTS (manager view)
@router.get("/")
def list_shipments(db: Session = Depends(get_db),
                   user=Depends(get_current_user)):
    return get_shipments(db, user)


# UPDATE STATUS
@router.put("/{shipment_id}/status")
def update_status(shipment_id: int, status: str,
                  db: Session = Depends(get_db),
                  user=Depends(get_current_user)):
    return update_shipment_status(db, user, shipment_id, status)
