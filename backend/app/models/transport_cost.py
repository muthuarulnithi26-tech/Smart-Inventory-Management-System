from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from datetime import datetime

from app.core.database import Base


class TransportCost(Base):
    __tablename__ = "transport_costs"

    id = Column(Integer, primary_key=True, index=True)

    shipment_id = Column(Integer, ForeignKey("shipments.id"))

    mode_of_transport = Column(String, nullable=False)
    payment_status = Column(String, default="pending")  # paid / pending

    fuel_cost = Column(Float, default=0)
    driver_cost = Column(Float, default=0)
    toll_cost = Column(Float, default=0)
    loading_cost = Column(Float, default=0)

    total_cost = Column(Float, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    