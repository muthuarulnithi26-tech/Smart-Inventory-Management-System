from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.shipment import Shipment
from app.models.inventory import Inventory
from app.models.stock_movement import StockMovement

from app.schemas.shipment import (
    ShipmentCreate,
    ShipmentResponse
)

router = APIRouter(
    prefix="/shipments",
    tags=["Shipments"]
)


# ---------------- CREATE SHIPMENT ----------------

@router.post(
    "/",
    response_model=ShipmentResponse
)
def create_shipment(
    data: ShipmentCreate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == data.order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved orders can be shipped"
        )

    shipment = Shipment(
        order_id=data.order_id,
        vehicle_type=data.vehicle_type,
        vehicle_number=data.vehicle_number,
        driver_name=data.driver_name
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment


# ---------------- DISPATCH SHIPMENT ----------------

@router.put("/{shipment_id}/dispatch")
def dispatch_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    if shipment.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Already processed"
        )

    order = db.query(Order).filter(
        Order.id == shipment.order_id
    ).first()

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    # STEP 1: Reduce Inventory + Create Stock Movement

    for item in order_items:

        inventory = db.query(Inventory).filter(
            Inventory.product_id == item.product_id,
            Inventory.warehouse_id == order.warehouse_id
        ).first()

        if not inventory:
            raise HTTPException(
                status_code=400,
                detail=f"Inventory not found for product {item.product_id}"
            )

        if inventory.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock"
            )

        # Reduce Stock
        inventory.quantity -= item.quantity

        # Stock Movement Log
        movement = StockMovement(
            product_id=item.product_id,
            warehouse_id=order.warehouse_id,
            movement_type="DISPATCH",
            quantity=item.quantity,
            reference_id=shipment.id
        )

        db.add(movement)

    # STEP 2: Update Statuses

    shipment.status = "dispatched"
    order.status = "dispatched"

    db.commit()

    return {
        "message": "Shipment dispatched and stock updated"
    }