from fastapi import APIRouter, HTTPException, status
from app.schemas import UserRegister, UserLogin, TokenResponse
from app.auth import hash_password, verify_password, create_access_token
from app.database import DB, run_query
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: UserRegister):
    existing = await run_query(lambda: DB.get_user_by_email(payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_id = str(uuid.uuid4())
    password_hash = hash_password(payload.password)
    await run_query(lambda: DB.create_user(user_id, payload.email, password_hash))

    token = create_access_token({"sub": user_id, "email": payload.email})
    return TokenResponse(access_token=token, user_id=user_id, email=payload.email)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    user = await run_query(lambda: DB.get_user_by_email(payload.email))
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return TokenResponse(access_token=token, user_id=user["id"], email=user["email"])
