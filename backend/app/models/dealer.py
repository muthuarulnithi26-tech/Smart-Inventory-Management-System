from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

from app.core.database import Base


class Dealer(Base):
    __tablename__ = "dealers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=True)

    address = Column(String, nullable=True)

    gst_number = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    