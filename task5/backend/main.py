"""FastAPI-бэкенд для КТ 5: JWT-сессия с access- и refresh-токенами.

Переменные окружения:
    ACCESS_TTL  — время жизни access-токена, секунды (по умолчанию 60)
    REFRESH_TTL — время жизни refresh-токена, секунды (по умолчанию 86400)
    JWT_SECRET  — ключ подписи (для учебного запуска есть значение по умолчанию)
"""
import hashlib
import hmac
import os
import secrets
import time
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me-32-bytes-minimum")
ACCESS_TTL = int(os.environ.get("ACCESS_TTL", "60"))
REFRESH_TTL = int(os.environ.get("REFRESH_TTL", "86400"))
ALGORITHM = "HS256"

app = FastAPI(title="Session API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=salt.encode(), n=2**14, r=8, p=1).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    salt = stored.split("$", 1)[0]
    return hmac.compare_digest(hash_password(password, salt), stored)


USERS = {"student": {"password": hash_password("student123"), "name": "Студент"}}

bearer = HTTPBearer(auto_error=False)


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UserInfo(BaseModel):
    username: str
    name: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class LoginResponse(TokenPair):
    user: UserInfo


class ProtectedData(BaseModel):
    message: str
    server_time: str


def create_token(username: str, kind: str, ttl: int) -> str:
    now = int(time.time())
    payload = {"sub": username, "type": kind, "iat": now, "exp": now + ttl}
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def issue_tokens(username: str) -> TokenPair:
    return TokenPair(
        access_token=create_token(username, "access", ACCESS_TTL),
        refresh_token=create_token(username, "refresh", REFRESH_TTL),
        expires_in=ACCESS_TTL,
    )


def current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> UserInfo:
    if credentials is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Требуется access-токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Access-токен недействителен или истёк")
    username = payload.get("sub")
    if payload.get("type") != "access" or username not in USERS:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Ожидается access-токен")
    return UserInfo(username=username, name=USERS[username]["name"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/login", response_model=LoginResponse)
def login(body: LoginRequest) -> LoginResponse:
    user = USERS.get(body.username)
    if user is None or not verify_password(body.password, user["password"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Неверный логин или пароль")
    tokens = issue_tokens(body.username)
    return LoginResponse(**tokens.model_dump(), user=UserInfo(username=body.username, name=user["name"]))


@app.post("/auth/refresh", response_model=TokenPair)
def refresh(body: RefreshRequest) -> TokenPair:
    try:
        payload = jwt.decode(body.refresh_token, SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh-токен недействителен или истёк")
    username = payload.get("sub")
    if payload.get("type") != "refresh" or username not in USERS:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Ожидается refresh-токен")
    return issue_tokens(username)


@app.get("/auth/me", response_model=UserInfo)
def me(user: Annotated[UserInfo, Depends(current_user)]) -> UserInfo:
    return user


@app.get("/protected/data", response_model=ProtectedData)
def protected_data(user: Annotated[UserInfo, Depends(current_user)]) -> ProtectedData:
    return ProtectedData(
        message=f"Данные доступны пользователю {user.name}: сессия действительна.",
        server_time=time.strftime("%Y-%m-%d %H:%M:%S"),
    )
