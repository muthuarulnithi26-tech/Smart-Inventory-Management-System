from fastapi import HTTPException

from app.models.shipment import Shipment
from app.models.container import Container
from app.models.dealer import Dealer


# ---------------- CREATE SHIPMENT ----------------

def create_shipment(
    db,
    data,
    user
):
    container = db.query(Container).filter(
        Container.id == data.container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container not found"
        )

    dealer = db.query(Dealer).filter(
        Dealer.id == data.dealer_id
    ).first()

    if not dealer:
        raise HTTPException(
            status_code=404,
            detail="Dealer not found"
        )

    existing_invoice = db.query(Shipment).filter(
        Shipment.invoice_number == data.invoice_number
    ).first()

    if existing_invoice:
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists"
        )

    shipment = Shipment(
        container_id=data.container_id,
        dealer_id=data.dealer_id,
        invoice_number=data.invoice_number,
        invoice_amount=data.invoice_amount,
        remarks=data.remarks,
        created_by=user.id
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment


# ---------------- GET ALL SHIPMENTS ----------------

def get_all_shipments(db):

    return db.query(Shipment).all()


# ---------------- GET SHIPMENT BY ID ----------------

def get_shipment_by_id(
    db,
    shipment_id
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    return shipment


# ---------------- MARK SHIPMENT AS PAID ----------------

def mark_shipment_paid(
    db,
    shipment_id
):
    shipment = get_shipment_by_id(
        db,
        shipment_id
    )

    shipment.payment_status = "paid"

    db.commit()
    db.refresh(shipment)

    return shipment


# ---------------- CANCEL SHIPMENT ----------------

def cancel_shipment(
    db,
    shipment_id
):
    shipment = get_shipment_by_id(
        db,
        shipment_id
    )

    shipment.payment_status = "cancelled"

    db.commit()
    db.refresh(shipment)

    return shipment
