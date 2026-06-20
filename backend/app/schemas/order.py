from pydantic import BaseModel


class OrderCreate(BaseModel):
    customer_id: int
    warehouse_id: int
    payment_type: str


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    warehouse_id: int
    payment_type: str
    total_amount: float
    status: str

    class Config:
        from_attributes = True
        