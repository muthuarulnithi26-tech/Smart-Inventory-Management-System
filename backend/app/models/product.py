from sqlalchemy import Column, Integer, String,Float, DateTime
from datetime import datetime
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    sku = Column(String, unique=True)

    unit = Column(String)

    purchase_price = Column(Float, default=0)

    selling_price = Column(Float, default=0)

    created_at = Column(DateTime)
