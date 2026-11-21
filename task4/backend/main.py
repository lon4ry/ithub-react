"""FastAPI-бэкенд для КТ 4: каталог товаров."""
import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Products API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Product(BaseModel):
    id: int
    title: str
    price: float
    category: str
    in_stock: bool


PRODUCTS: list[Product] = [
    Product(id=1, title="Клавиатура", price=3500, category="Периферия", in_stock=True),
    Product(id=2, title="Мышь", price=1200, category="Периферия", in_stock=True),
    Product(id=3, title="Монитор 27\"", price=18900, category="Мониторы", in_stock=False),
    Product(id=4, title="Ноутбук", price=74990, category="Компьютеры", in_stock=True),
]

# Искусственная задержка, чтобы состояние загрузки было видно в интерфейсе
DELAY_SECONDS = 0.7


@app.get("/products", response_model=list[Product])
async def list_products() -> list[Product]:
    await asyncio.sleep(DELAY_SECONDS)
    return PRODUCTS


@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int) -> Product:
    await asyncio.sleep(DELAY_SECONDS)
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    raise HTTPException(status_code=404, detail="Товар не найден")
