from fastapi import APIRouter, Depends, HTTPException
from app.schemas import ReelCreate, ReelResponse
from app.auth import get_current_user
from app.database import DB, run_query
from app.analytics import compute_engagement_rate
import uuid

router = APIRouter(prefix="/reels", tags=["Reels"])


@router.post("/", response_model=ReelResponse, status_code=201)
async def create_reel(
    payload: ReelCreate,
    current_user: dict = Depends(get_current_user),
):
    engagement_rate = compute_engagement_rate(
        payload.views, payload.likes, payload.comments, payload.shares
    )
    data = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["user_id"],
        "topic": payload.topic,
        "format": payload.format,
        "views": payload.views,
        "likes": payload.likes,
        "comments": payload.comments,
        "shares": payload.shares,
        "length": payload.length,
        "engagement_rate": engagement_rate,
    }
    result = await run_query(lambda: DB.create_reel(data))
    return ReelResponse(**result)


@router.get("/", response_model=list[ReelResponse])
async def list_reels(limit: int = 20, current_user: dict = Depends(get_current_user)):
    rows = await run_query(lambda: DB.list_reels(current_user["user_id"], limit))
    return rows


@router.get("/{reel_id}", response_model=ReelResponse)
async def get_reel(reel_id: str, current_user: dict = Depends(get_current_user)):
    row = await run_query(lambda: DB.get_reel(reel_id, current_user["user_id"]))
    if not row:
        raise HTTPException(status_code=404, detail="Reel not found")
    return row


@router.delete("/{reel_id}", status_code=204)
async def delete_reel(reel_id: str, current_user: dict = Depends(get_current_user)):
    deleted = await run_query(lambda: DB.delete_reel(reel_id, current_user["user_id"]))
    if not deleted:
        raise HTTPException(status_code=404, detail="Reel not found")
