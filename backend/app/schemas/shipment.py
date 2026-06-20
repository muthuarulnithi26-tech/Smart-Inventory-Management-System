from pydantic import BaseModel


class ShipmentCreate(BaseModel):
    order_id: int
    vehicle_type: str
    vehicle_number: str
    driver_name: str


class ShipmentResponse(BaseModel):
    id: int
    order_id: int
    vehicle_type: str
    vehicle_number: str
    driver_name: str
    status: str

    class Config:
        from_attributes = True

        