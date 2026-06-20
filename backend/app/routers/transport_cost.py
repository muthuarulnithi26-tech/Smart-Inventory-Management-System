from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.shipment import Shipment
from app.models.transport_cost import TransportCost

from app.schemas.transport_cost import (
    TransportCostCreate,
    TransportCostResponse,
    TransportCostUpdate
)

router = APIRouter(
    prefix="/transport-cost",
    tags=["Transport Cost"]
)

@router.post("/", response_model=TransportCostResponse)
def create_transport_cost(
    data: TransportCostCreate,
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == data.shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    total = (
        data.fuel_cost +
        data.driver_cost +
        data.toll_cost +
        data.loading_cost
    )

    cost = TransportCost(
        shipment_id=data.shipment_id,
        mode_of_transport=data.mode_of_transport,
        payment_status=data.payment_status,
        fuel_cost=data.fuel_cost,
        driver_cost=data.driver_cost,
        toll_cost=data.toll_cost,
        loading_cost=data.loading_cost,
        total_cost=total
    )

    db.add(cost)
    db.commit()
    db.refresh(cost)

    return cost

@router.put("/{cost_id}/pay")
def mark_paid(
    cost_id: int,
    db: Session = Depends(get_db)
):
    cost = db.query(TransportCost).filter(
        TransportCost.id == cost_id
    ).first()

    if not cost:
        raise HTTPException(
            status_code=404,
            detail="Cost not found"
        )

    cost.payment_status = "paid"

    db.commit()

    return {
        "message": "Transport marked as paid"
    }

@router.get("/", response_model=list[TransportCostResponse])
def get_costs(db: Session = Depends(get_db)):
    return db.query(TransportCost).all()

