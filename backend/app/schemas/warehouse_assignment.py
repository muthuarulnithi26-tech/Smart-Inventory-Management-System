from pydantic import BaseModel
from typing import Optional


class WarehouseAssignmentCreate(BaseModel):
    user_id: int
    warehouse_id: int
    role: str = "staff"


class WarehouseAssignmentResponse(BaseModel):
    id: int
    user_id: int
    warehouse_id: int
    role: str

    class Config:
        from_attributes = True
        