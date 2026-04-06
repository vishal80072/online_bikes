import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base


class Bike(Base):
    __tablename__ = "bikes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True) 
    engine_cc = Column(Integer, nullable=True)
    price_per_day = Column(Float, nullable=False)
    price_purchase = Column(Float, nullable=True)
    color = Column(String(50), nullable=True)
    mileage = Column(Float, nullable=True)
    fuel_type = Column(String(30), default="petrol")
    description = Column(Text, nullable=True)
    features = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    available = Column(Boolean, default=True)
    stock = Column(Integer, default=1)
    is_deleted = Column(Boolean, default=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())