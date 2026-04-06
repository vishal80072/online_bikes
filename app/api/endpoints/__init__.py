from fastapi import APIRouter
from app.api.endpoints import auth, bikes, chat

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(bikes.router)
api_router.include_router(chat.router)