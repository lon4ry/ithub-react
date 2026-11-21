# React + TypeScript — практические задания

Пять учебных проектов на Vite + React + TypeScript и финальный fullstack-проект с FastAPI.

## Задания

| # | Тема | Папка |
|---|---|---|
| 1 | Условный рендеринг и списки | `task1/` |
| 2 | Context API | `task2/` |
| 3 | Защищённые маршруты | `task3/` |
| 4 | API и Zustand | `task4/` + `task4/backend/` |
| 5 | Авторизация и refresh-токены | `task5/` + `task5/backend/` |
| 6 | Итоговый fullstack-проект | `final/` + `final/backend/` |

Тексты заданий — в `materials/`, ответы — в `answers/`.

## Запуск

```sh
cd taskN
npm install
npm run dev
```

Бэкенд:

```sh
cd taskN/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Адрес API задаётся через `VITE_API_URL` (по умолчанию `http://localhost:8000`). Тестовый пользователь в task5 и final: `student` / `student123`.
