from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ➕ CREATE WAREHOUSE (INPUT)
class WarehouseCreate(BaseModel):
    name: str
    location: str
    capacity: int
    

# ✏️ UPDATE WAREHOUSE (INPUT)
class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None


# 📤 RESPONSE (OUTPUT)
class WarehouseResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    created_by: int
    created_at: datetime
    is_active: bool
    class Config:
        from_attributes = True
        