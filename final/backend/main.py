"""FastAPI-бэкенд финального проекта: задачи пользователя с JWT-авторизацией.

Данные хранятся в памяти процесса — учебный вариант без БД.
Переменные окружения: JWT_SECRET, ACCESS_TTL (сек), REFRESH_TTL (сек), API_DELAY (сек).
"""
import asyncio
import hashlib
import hmac
import os
import secrets
import time
from typing import Annotated, Literal

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me-32-bytes-minimum")
ACCESS_TTL = int(os.environ.get("ACCESS_TTL", "900"))
REFRESH_TTL = int(os.environ.get("REFRESH_TTL", "86400"))
ALGORITHM = "HS256"
# Задержка, чтобы состояния loading были видны в интерфейсе
DELAY_SECONDS = float(os.environ.get("API_DELAY", "0.5"))

app = FastAPI(title="Tasks API")
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


TaskPriority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(default="", max_length=2000)
    priority: TaskPriority = "medium"


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    priority: TaskPriority | None = None
    done: bool | None = None


class Task(BaseModel):
    id: int
    title: str
    description: str
    priority: TaskPriority
    done: bool
    created_at: str


USERS = {"student": {"password": hash_password("student123"), "name": "Студент"}}

TASKS: dict[str, list[Task]] = {
    "student": [
        Task(
            id=1,
            title="Разобрать роутинг",
            description="Динамический маршрут /tasks/:id и страница 404",
            priority="high",
            done=True,
            created_at="2026-11-18",
        ),
        Task(
            id=2,
            title="Подключить Zustand",
            description="Хранилище задач с состояниями loading/error/data",
            priority="medium",
            done=False,
            created_at="2026-11-19",
        ),
        Task(
            id=3,
            title="Написать FastAPI-бэкенд",
            description="JWT-авторизация, CRUD задач, CORS",
            priority="high",
            done=False,
            created_at="2026-11-20",
        ),
    ]
}
NEXT_ID = {"value": 4}

bearer = HTTPBearer(auto_error=False)


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


def find_task(username: str, task_id: int) -> Task:
    for task in TASKS.setdefault(username, []):
        if task.id == task_id:
            return task
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Задача не найдена")


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


@app.get("/tasks", response_model=list[Task])
async def list_tasks(user: Annotated[UserInfo, Depends(current_user)]) -> list[Task]:
    await asyncio.sleep(DELAY_SECONDS)
    return TASKS.setdefault(user.username, [])


@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(body: TaskCreate, user: Annotated[UserInfo, Depends(current_user)]) -> Task:
    await asyncio.sleep(DELAY_SECONDS)
    task = Task(
        id=NEXT_ID["value"],
        title=body.title,
        description=body.description,
        priority=body.priority,
        done=False,
        created_at=time.strftime("%Y-%m-%d"),
    )
    NEXT_ID["value"] += 1
    TASKS.setdefault(user.username, []).insert(0, task)
    return task


@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int, user: Annotated[UserInfo, Depends(current_user)]) -> Task:
    await asyncio.sleep(DELAY_SECONDS)
    return find_task(user.username, task_id)


@app.patch("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    body: TaskUpdate,
    user: Annotated[UserInfo, Depends(current_user)],
) -> Task:
    await asyncio.sleep(DELAY_SECONDS)
    task = find_task(user.username, task_id)
    updated = task.model_copy(update=body.model_dump(exclude_none=True))
    tasks = TASKS[user.username]
    tasks[tasks.index(task)] = updated
    return updated


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, user: Annotated[UserInfo, Depends(current_user)]) -> None:
    await asyncio.sleep(DELAY_SECONDS)
    task = find_task(user.username, task_id)
    TASKS[user.username].remove(task)
