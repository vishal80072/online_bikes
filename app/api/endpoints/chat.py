from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.bike_service import BikeService
from app.services.chat_service import get_bike_suggestion

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest, db: AsyncSession = Depends(get_db)):
    service = BikeService(db)
    bikes = await service.get_all_for_llm()
    reply = await get_bike_suggestion(body.message, bikes)
    return ChatResponse(reply=reply)