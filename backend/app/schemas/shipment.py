from pydantic import BaseModel
from datetime import datetime


class ShipmentCreate(BaseModel):
    order_id: int
    vehicle_type: str
    vehicle_number: str
    driver_name: str


class ShipmentResponse(BaseModel):
    id: int
    order_id: int
    warehouse_id: int
    created_by: int

    vehicle_type: str
    vehicle_number: str | None = None
    driver_name: str | None = None

    status: str
    created_at: datetime

    class Config:
        from_attributes = True
        