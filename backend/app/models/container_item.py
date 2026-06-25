from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from app.core.database import Base


class ContainerItem(Base):
    __tablename__ = "container_items"

    id = Column(Integer, primary_key=True, index=True)

    container_id = Column(
        Integer,
        ForeignKey("containers.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    quantity = Column(
        Integer,
        nullable=False
    )