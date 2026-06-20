from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ---------------- CREATE ----------------
class ProductCreate(BaseModel):
    name: str
    sku: str
    unit: str

    purchase_price: float
    selling_price: float

# ---------------- UPDATE ----------------

class ProductUpdate(BaseModel):

    name: str | None = None

    sku: str | None = None

    unit: str | None = None

    purchase_price: float | None = None

    selling_price: float | None = None

# ---------------- RESPONSE ----------------

class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    unit: str

    purchase_price: float
    selling_price: float

    class Config:
        from_attributes = True

