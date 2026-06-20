from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from app.core.database import Base


class Container(Base):
    __tablename__ = "containers"

    id = Column(Integer, primary_key=True, index=True)

    container_number = Column(
        String,
        unique=True,
        nullable=False
    )

    source_warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id")
    )

    destination_warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id")
    )

    status = Column(
        String,
        default="CREATED"
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )