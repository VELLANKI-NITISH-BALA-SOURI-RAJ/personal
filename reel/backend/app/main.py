from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, reels, analytics, scripts, chat
from app.auth import get_current_user
from app.database import init_db

app = FastAPI(
    title="Reel Growth OS API",
    description="Performance-driven short-form content intelligence system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(reels.router)
app.include_router(analytics.router)
app.include_router(scripts.router)
app.include_router(chat.router)


# ─── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()


# ─── Health Check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "operational", "product": "Reel Growth OS", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}


# ─── Protected /auth/me endpoint ──────────────────────────────────────────────
@app.get("/auth/me", tags=["Authentication"])
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
