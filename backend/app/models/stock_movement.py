from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from datetime import datetime

from app.core.database import Base


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, ForeignKey("products.id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))

    movement_type = Column(String)  # DISPATCH / RETURN / PURCHASE / ADJUSTMENT

    quantity = Column(Float, nullable=False)

    reference_id = Column(Integer)  # order_id or shipment_id

    created_at = Column(DateTime, default=datetime.utcnow)