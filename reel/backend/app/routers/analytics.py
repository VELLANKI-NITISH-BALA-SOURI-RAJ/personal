from fastapi import APIRouter, Depends
from app.schemas import AnalyticsResponse
from app.auth import get_current_user
from app.database import DB, run_query
from app.analytics import analyze_performance

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(current_user: dict = Depends(get_current_user)):
    reels = await run_query(lambda: DB.list_reels(current_user["user_id"], limit=100))
    analytics = analyze_performance(reels)
    return AnalyticsResponse(**analytics)
