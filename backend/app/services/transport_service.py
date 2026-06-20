from fastapi import HTTPException

from app.models.container import Container
from app.models.transport_cost import TransportCost

def create_transport_cost(db, data):

    container = db.query(Container).filter(
        Container.id == data.container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container not found"
        )

    total = (
        data.fuel_cost +
        data.driver_cost +
        data.toll_cost +
        data.maintenance_cost +
        data.other_cost
    )

    cost = TransportCost(
        container_id=data.container_id,
        fuel_cost=data.fuel_cost,
        driver_cost=data.driver_cost,
        toll_cost=data.toll_cost,
        maintenance_cost=data.maintenance_cost,
        other_cost=data.other_cost,
        total_cost=total
    )

    db.add(cost)
    db.commit()
    db.refresh(cost)

    return cost

