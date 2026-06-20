from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class DealerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    gst_number: Optional[str] = None


class DealerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    gst_number: Optional[str] = None
    is_active: Optional[bool] = None


class DealerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str]
    address: Optional[str]
    gst_number: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
        