from pydantic import BaseModel


class OrderCreate(BaseModel):
    customer_id: int
    payment_type: str


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    selling_price: float


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    warehouse_id: int
    created_by: int
    payment_type: str
    total_amount: float
    status: str

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    selling_price: float
    subtotal: float

    class Config:
        from_attributes = True
        