import math
from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models.bike import Bike
from app.utils.bike_schemas import BikeCreate, BikeUpdate, BikeOut, BikePaginatedResponse
from app.cache.redis_client import cache_get, cache_set, cache_delete, cache_delete_pattern


class BikeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: BikeCreate) -> Bike:
        bike = Bike(**data.model_dump())
        self.db.add(bike)
        await self.db.flush()
        await cache_delete_pattern("bikes:*")
        return bike

    async def get_by_id(self, bike_id: str) -> Optional[Bike]:
        cache_key = f"bikes:detail:{bike_id}"
        cached = await cache_get(cache_key)
        if cached:
            return cached

        result = await self.db.execute(
            select(Bike).where(Bike.id == UUID(bike_id), Bike.is_deleted == False)
        )
        bike = result.scalar_one_or_none()
        if bike:
            out = BikeOut.from_orm(bike).model_dump()
            await cache_set(cache_key, out)
        return bike

    async def update(self, bike_id: str, data: BikeUpdate) -> Optional[Bike]:
        result = await self.db.execute(
            select(Bike).where(Bike.id == UUID(bike_id), Bike.is_deleted == False)
        )
        bike = result.scalar_one_or_none()
        if not bike:
            return None
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(bike, k, v)
        await self.db.flush()
        await cache_delete(f"bikes:detail:{bike_id}")
        await cache_delete_pattern("bikes:list:*")
        return bike

    async def soft_delete(self, bike_id: str) -> bool:
        result = await self.db.execute(
            select(Bike).where(Bike.id == UUID(bike_id), Bike.is_deleted == False)
        )
        bike = result.scalar_one_or_none()
        if not bike:
            return False
        bike.is_deleted = True
        await self.db.flush()
        await cache_delete(f"bikes:detail:{bike_id}")
        await cache_delete_pattern("bikes:list:*")
        return True

    async def list_bikes(
        self,
        page: int = 1,
        size: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        available: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> BikePaginatedResponse:
        cache_key = f"bikes:list:{page}:{size}:{search}:{category}:{brand}:{min_price}:{max_price}:{available}:{sort_by}:{sort_order}"
        cached = await cache_get(cache_key)
        if cached:
            return BikePaginatedResponse(**cached)

        query = select(Bike).where(Bike.is_deleted == False)

        if search:
            query = query.where(
                or_(
                    Bike.name.ilike(f"%{search}%"),
                    Bike.brand.ilike(f"%{search}%"),
                    Bike.model.ilike(f"%{search}%"),
                    Bike.description.ilike(f"%{search}%"),
                )
            )
        if category:
            query = query.where(Bike.category == category)
        if brand:
            query = query.where(Bike.brand.ilike(f"%{brand}%"))
        if min_price is not None:
            query = query.where(Bike.price_per_day >= min_price)
        if max_price is not None:
            query = query.where(Bike.price_per_day <= max_price)
        if available is not None:
            query = query.where(Bike.available == available)

        count_q = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_q)).scalar_one()

        col = getattr(Bike, sort_by, Bike.created_at)
        query = query.order_by(col.desc() if sort_order == "desc" else col.asc())
        query = query.offset((page - 1) * size).limit(size)

        result = await self.db.execute(query)
        bikes = result.scalars().all()
        items = [BikeOut.from_orm(b).model_dump() for b in bikes]

        response = BikePaginatedResponse(
            total=total,
            page=page,
            size=size,
            pages=math.ceil(total / size) if total else 0,
            items=items,
        )
        await cache_set(cache_key, response.model_dump(), ttl=120)
        return response

    async def get_all_for_llm(self) -> List[dict]:
        """Return all bikes as plain dicts for LLM context."""
        result = await self.db.execute(
            select(Bike).where(Bike.is_deleted == False, Bike.available == True)
        )
        bikes = result.scalars().all()
        return [BikeOut.from_orm(b).model_dump() for b in bikes]