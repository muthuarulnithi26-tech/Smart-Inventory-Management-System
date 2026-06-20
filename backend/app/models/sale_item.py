from sqlalchemy import Column, Integer, ForeignKey, Float

from app.core.database import Base


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)

    sale_id = Column(
        Integer,
        ForeignKey("sales.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    quantity = Column(Integer)

    unit_price = Column(Float)

    subtotal = Column(Float)
    