from app.db.session import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.config import settings
from app.models.user import User
from sqlalchemy import select


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        existing = result.scalar_one_or_none()
        if not existing:
            admin = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Super Admin",
                role="admin",
                is_active=True,
            )
            db.add(admin)
            await db.commit()