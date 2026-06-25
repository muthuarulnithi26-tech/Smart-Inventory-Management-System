from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.shipment import Shipment
from app.models.order import Order


def create_shipment(db: Session, user, order_id: int, vehicle_type: str):

    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can create shipment")

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Order not approved yet")

    shipment = Shipment(
        order_id=order_id,
        warehouse_id=user.id,  # later replaced with warehouse mapping
        created_by=user.id,
        status="PENDING",
        vehicle_type=vehicle_type,
        tracking_number=f"TRK-{order_id}-{user.id}"
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment

def update_shipment_status(db: Session, user, shipment_id: int, status: str):

    if user.role != "manager":
        raise HTTPException(status_code=403, detail="Only manager can update shipment")

    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    shipment.status = status

    db.commit()

    return shipment

