from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
    DateTime
)

from app.core.database import Base


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    warehouse_id = Column(
        Integer,
        ForeignKey("warehouses.id")
    )

    # DISPATCH / RETURN / PURCHASE / ADJUSTMENT
    movement_type = Column(
        String
    )

    quantity = Column(
        Float,
        nullable=False
    )

    # order_id or shipment_id
    reference_id = Column(
        Integer
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    