from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: float
    selling_price: float


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: float
    selling_price: float
    subtotal: float

    class Config:
        from_attributes = True
        