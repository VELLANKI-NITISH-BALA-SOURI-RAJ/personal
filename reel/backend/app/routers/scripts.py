from fastapi import APIRouter, Depends, HTTPException
from app.schemas import ScriptGenerateRequest, ScriptResponse
from app.auth import get_current_user
from app.database import DB, run_query
from app.analytics import analyze_performance
from app.gemini import generate_script
import uuid

router = APIRouter(prefix="/scripts", tags=["Scripts"])


@router.post("/generate", response_model=ScriptResponse, status_code=201)
async def generate(
    payload: ScriptGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]
    reels = await run_query(lambda: DB.list_reels(user_id, limit=100))
    analytics = analyze_performance(reels)

    script_json = await generate_script(
        topic=payload.topic,
        analytics=analytics,
        format_hint=payload.format,
        target_length=payload.target_length,
        additional_context=payload.additional_context,
    )

    if "error" in script_json and not script_json.get("hooks"):
        raise HTTPException(status_code=502, detail="AI generation failed. Please try again.")

    script_id = str(uuid.uuid4())
    saved = await run_query(lambda: DB.save_script(script_id, user_id, payload.topic, script_json))
    return ScriptResponse(**saved)


@router.get("/", response_model=list[ScriptResponse])
async def list_scripts(limit: int = 10, current_user: dict = Depends(get_current_user)):
    rows = await run_query(lambda: DB.list_scripts(current_user["user_id"], limit))
    return rows
