from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    DateTime
)

from datetime import datetime

from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id")
    )

    warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id")
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    payment_type = Column(
        String,
        nullable=False
    )

    total_amount = Column(
        Float,
        default=0
    )

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    