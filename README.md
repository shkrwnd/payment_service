# Navout Payments

Full-stack app with the same structure and design patterns as [canon](https://github.com/your-org/canon): FastAPI backend (repositories, services, dependency injection) and React frontend (api client, services, hooks, AuthContext) with Login, Signup, Home, and protected Items pages. UI uses shadcn-style components (Tailwind + Radix).

## How to run

### Backend

Use **Python 3.10–3.12** (3.14 can hit pydantic install issues). From the project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Copy `backend/.env.example` to `backend/.env` if you need to override settings (e.g. `SECRET_KEY`, `JWT_*`, `DATABASE_URL`). The API runs at **http://localhost:8000**. Tables are created on startup via `init_db()`, so you don’t need to run migrations to start the app.

### Frontend

From the project root:

```bash
cd frontend
npm install
npm start
```

Set `REACT_APP_API_URL=http://localhost:8000` in `frontend/.env` if the API is not on that URL.

---

## Project structure

- **backend/** — FastAPI, SQLAlchemy, Alembic. `app/`: `api/routes`, `api/dependencies`, `services`, `repositories`, `models`, `schemas`, `core`, `config`, `exceptions`.
- **frontend/** — Create React App (TypeScript), React Query, React Router. `src/`: `api`, `services`, `hooks`, `contexts`, `pages`, `layouts`, `routes`, `components/ui` (shadcn-style), `components/auth`, `components/shared`.

## Backend

- **Requirements:** Python 3.10–3.12 recommended (Python 3.14 may have pydantic compatibility issues).
- **Setup:**
  ```bash
  cd backend
  python -m venv .venv
  source .venv/bin/activate   # or .venv\Scripts\activate on Windows
  pip install -r requirements.txt
  cp .env.example .env        # set DATABASE_URL, SECRET_KEY if needed
  ```
- **Database:** Tables are created automatically on first run via `init_db()`. Optional: run `alembic upgrade head` for migrations.
- **Run:**
  ```bash
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Endpoints:** `GET /`, `GET /health`, `POST /api/auth/register`, `POST /api/auth/login`, `GET/POST/PUT/DELETE /api/items`, `GET/PUT/DELETE /api/items/{id}`.

## Frontend

- **Setup:**
  ```bash
  cd frontend
  npm install
  cp .env.example .env   # set REACT_APP_API_URL=http://localhost:8000
  ```
- **Run:**
  ```bash
  npm start
  ```
- **Pages:** `/` Home, `/login`, `/signup`, `/items` (protected). Auth uses JWT stored in localStorage; 401 redirects to `/login`.

## Environment

- **Backend `.env`:** `DATABASE_URL` (default `sqlite:///./navout_payments.db`), `SECRET_KEY` or `JWT_SECRET_KEY`, `CORS_ORIGINS`.
- **Frontend `.env`:** `REACT_APP_API_URL` (default `http://localhost:8000`).
