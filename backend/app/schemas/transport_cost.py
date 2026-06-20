from pydantic import BaseModel


class TransportCostCreate(BaseModel):
    shipment_id: int
    mode_of_transport: str
    payment_status: str = "pending"

    fuel_cost: float
    driver_cost: float
    toll_cost: float
    loading_cost: float


class TransportCostUpdate(BaseModel):
    payment_status: str | None = None


class TransportCostResponse(BaseModel):
    id: int
    shipment_id: int
    mode_of_transport: str
    payment_status: str

    fuel_cost: float
    driver_cost: float
    toll_cost: float
    loading_cost: float

    total_cost: float

    class Config:
        from_attributes = True
          