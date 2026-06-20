from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from app.core.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, default=0)

    updated_at = Column(DateTime, default=datetime.utcnow)