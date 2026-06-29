from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.shipment import Shipment
from app.models.order import Order
from app.models.warehouse_assignment import WarehouseAssignment


# ======================================================
# GET USER'S ASSIGNED WAREHOUSE
# ======================================================

def _get_user_warehouse(db: Session, user):

    assignment = db.query(WarehouseAssignment).filter(
        WarehouseAssignment.user_id == user.id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=400,
            detail="User not assigned to warehouse"
        )

    return assignment.warehouse_id


# ======================================================
# CREATE SHIPMENT (STAFF)
# ======================================================

def create_shipment(
    db: Session,
    user,
    order_id: int,
    vehicle_type: str,
    vehicle_number: str,
    driver_name: str,
):

    # Only staff can create shipment
    if user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Only staff can create shipment"
        )

    # Check order
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Order must be approved
    if order.status != "APPROVED":
        raise HTTPException(
            status_code=400,
            detail="Order not approved yet"
        )

    # Staff warehouse
    user_warehouse_id = _get_user_warehouse(db, user)

    # Staff can create shipment only for their warehouse
    if order.warehouse_id != user_warehouse_id:
        raise HTTPException(
            status_code=403,
            detail="Wrong warehouse access"
        )

    # Prevent duplicate shipment
    existing = db.query(Shipment).filter(
        Shipment.order_id == order.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Shipment already exists for this order"
        )

    shipment = Shipment(
        order_id=order.id,
        warehouse_id=order.warehouse_id,
        created_by=user.id,
        vehicle_type=vehicle_type,
        vehicle_number=vehicle_number,
        driver_name=driver_name,
        status="PENDING"
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment


# ======================================================
# UPDATE SHIPMENT STATUS
# ======================================================
def update_shipment_status(db, user, shipment_id, status):

    if user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Only staff can update shipment status"
        )

    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id,
        Shipment.created_by == user.id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    # Allowed Flow
    if shipment.status == "PENDING":

        if status != "IN_TRANSIT":
            raise HTTPException(
                status_code=400,
                detail="Shipment must be dispatched first"
            )

    elif shipment.status == "IN_TRANSIT":

        if status != "DELIVERED":
            raise HTTPException(
                status_code=400,
                detail="Shipment can only be marked as DELIVERED"
            )

    elif shipment.status == "DELIVERED":

        raise HTTPException(
            status_code=400,
            detail="Shipment already delivered"
        )

    shipment.status = status

    db.commit()
    db.refresh(shipment)

    return shipment


# ======================================================
# GET SHIPMENTS
# ======================================================

def get_shipments(
    db: Session,
    user
):

    # Admin sees all shipments
    if user.role == "admin":
        return db.query(Shipment).all()

    # Manager sees shipments in their warehouse
    if user.role == "manager":

        warehouse_id = _get_user_warehouse(db, user)

        return db.query(Shipment).filter(
            Shipment.warehouse_id == warehouse_id
        ).all()

    # Staff sees only their shipments
    if user.role == "staff":

        return db.query(Shipment).filter(
            Shipment.created_by == user.id
        ).all()

    raise HTTPException(
        status_code=403,
        detail="Not allowed"
    )
