from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ──────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


# ─── Reel Schemas ──────────────────────────────────────────────────────────────

class ReelCreate(BaseModel):
    topic: str
    format: str  # e.g. "talking_head", "voiceover", "text_overlay", "trending_audio"
    views: int
    likes: int
    comments: int
    shares: int
    length: int  # seconds


class ReelResponse(BaseModel):
    id: str
    user_id: str
    topic: str
    format: str
    views: int
    likes: int
    comments: int
    shares: int
    length: int
    engagement_rate: float
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Analytics Schemas ─────────────────────────────────────────────────────────

class FormatPerformance(BaseModel):
    format: str
    avg_engagement: float
    reel_count: int


class AnalyticsResponse(BaseModel):
    total_reels: int
    avg_engagement_rate: float
    best_format: Optional[str]
    ideal_length: Optional[int]
    pattern_status: str  # insufficient_data | no_clear_pattern | pattern_detected
    confidence: float
    format_breakdown: list[FormatPerformance]
    top_topic: Optional[str]
    recent_trend: Optional[str]


# ─── Script Schemas ────────────────────────────────────────────────────────────

class ScriptGenerateRequest(BaseModel):
    topic: str
    format: Optional[str] = None
    target_length: Optional[int] = None
    additional_context: Optional[str] = None


class ScriptResponse(BaseModel):
    id: str
    topic: str
    script_json: dict
    created_at: datetime


# ─── Chat Schemas ──────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    role: str = "assistant"
