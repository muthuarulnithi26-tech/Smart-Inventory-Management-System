from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.core.database import Base


class WarehouseAssignment(Base):
    __tablename__ = "warehouse_assignments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)

    role = Column(String, default="staff")
    # roles: admin, manager, staff

    created_at = Column(DateTime, default=datetime.utcnow)