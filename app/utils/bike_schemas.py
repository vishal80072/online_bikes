from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class BikeCreate(BaseModel):
    name: str
    brand: str
    model: str
    category: str
    engine_cc: Optional[int] = None
    price_per_day: float
    price_purchase: Optional[float] = None
    color: Optional[str] = None
    mileage: Optional[float] = None
    fuel_type: Optional[str] = "petrol"
    description: Optional[str] = None
    features: Optional[str] = None
    image_url: Optional[str] = None
    available: Optional[bool] = True
    stock: Optional[int] = 1


class BikeUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    engine_cc: Optional[int] = None
    price_per_day: Optional[float] = None
    price_purchase: Optional[float] = None
    color: Optional[str] = None
    mileage: Optional[float] = None
    fuel_type: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None
    image_url: Optional[str] = None
    available: Optional[bool] = None
    stock: Optional[int] = None


class BikeOut(BaseModel):
    id: UUID
    name: str
    brand: str
    model: str
    category: str
    engine_cc: Optional[int]
    price_per_day: float
    price_purchase: Optional[float]
    color: Optional[str]
    mileage: Optional[float]
    fuel_type: Optional[str]
    description: Optional[str]
    features: Optional[str]
    image_url: Optional[str]
    available: bool
    stock: int
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class BikePaginatedResponse(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    items: List[BikeOut]