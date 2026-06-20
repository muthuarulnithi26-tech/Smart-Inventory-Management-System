from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.core.database import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id"))

    vehicle_type = Column(String)
    vehicle_number = Column(String)
    driver_name = Column(String)

    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)
    