from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.bike_service import BikeService
from app.utils.bike_schemas import BikeCreate, BikeUpdate, BikeOut, BikePaginatedResponse
from app.core.dependencies import get_current_admin, get_current_user
from app.models.user import User

router = APIRouter(prefix="/bikes", tags=["Bikes"])


@router.get("", response_model=BikePaginatedResponse)
async def list_bikes(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    available: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: AsyncSession = Depends(get_db),
):
    service = BikeService(db)
    return await service.list_bikes(
        page=page, size=size, search=search, category=category,
        brand=brand, min_price=min_price, max_price=max_price,
        available=available, sort_by=sort_by, sort_order=sort_order,
    )


@router.get("/{bike_id}", response_model=BikeOut)
async def get_bike(bike_id: str, db: AsyncSession = Depends(get_db)):
    service = BikeService(db)
    bike = await service.get_by_id(bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    return bike


@router.post("", response_model=BikeOut, status_code=201)
async def create_bike(
    data: BikeCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = BikeService(db)
    bike = await service.create(data)
    await db.commit()
    return bike


@router.put("/{bike_id}", response_model=BikeOut)
async def update_bike(
    bike_id: str,
    data: BikeUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = BikeService(db)
    bike = await service.update(bike_id, data)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    await db.commit()
    return bike


@router.delete("/{bike_id}", status_code=204)
async def delete_bike(
    bike_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = BikeService(db)
    deleted = await service.soft_delete(bike_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Bike not found")
    await db.commit()