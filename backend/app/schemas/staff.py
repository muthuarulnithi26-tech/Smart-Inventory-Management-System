from pydantic import BaseModel


class StaffDashboardResponse(BaseModel):
    total_orders: int
    pending_orders: int
    approved_orders: int
    rejected_orders: int
    stock_items: int


class StaffOrderResponse(BaseModel):
    id: int
    customer_id: int
    warehouse_id: int
    created_by: int
    total_amount: float
    status: str

    class Config:
        from_attributes = True


class StaffStockResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int