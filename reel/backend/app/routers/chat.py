from fastapi import APIRouter, Depends
from app.schemas import ChatRequest, ChatResponse
from app.auth import get_current_user
from app.database import DB, run_query
from app.analytics import analyze_performance
from app.gemini import chat_with_assistant

router = APIRouter(prefix="/chat", tags=["Chat Assistant"])


@router.post("/", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    reels = await run_query(lambda: DB.list_reels(current_user["user_id"], limit=100))
    analytics = analyze_performance(reels)
    history = [msg.model_dump() for msg in payload.history]
    reply = await chat_with_assistant(message=payload.message, history=history, analytics=analytics)
    return ChatResponse(reply=reply)
