# Phase 0 — Project Scaffolding

Goal: a running frontend and backend that can talk to each other, with a health check endpoint and pre-commit hooks enforcing code quality.

---

## 1. Repository structure

- [x] Create `backend/` directory at the repo root
- [x] Confirm final structure matches:
  ```
  ./
    frontend/    # Vue 3 + TypeScript (Vite)
    backend/     # Python (FastAPI)
    plan/
    README.md
  ```

---

## 2. Backend — FastAPI

- [x] Create `backend/` with the following layout:
  ```
  backend/
    main.py
    requirements.txt
  ```
- [x] Install backend dependencies: `pip install fastapi uvicorn[standard]` and freeze with `pip freeze > backend/requirements.txt`
- [x] Implement a `GET /health` endpoint in `main.py` that returns `{ "status": "ok" }`
- [x] Confirm the backend runs locally with `uvicorn main:app --reload`

---

## 3. Frontend — Vue 3

- [x] Confirm `frontend/` Vite dev server runs with `npm run dev`
- [x] Add a `VITE_API_URL` environment variable to `frontend/.env.development` pointing to the local backend (e.g. `http://localhost:8000`)
- [x] Call `GET /health` from the frontend on app load and log the response to confirm the two services can communicate
- [x] Configure Vite dev server proxy so frontend requests to `/api` are forwarded to the backend (avoids CORS issues in development)

---

## 4. Docker Compose — development environment

- [x] Create `docker-compose.yml` at the repo root with two services:
  - `frontend`: Node image, mounts `./frontend`, runs `npm run dev`, exposes port 5173
  - `backend`: Python image, mounts `./backend`, runs `uvicorn main:app --reload`, exposes port 8000
- [ ] Confirm both services start with `docker compose up`
- [ ] Confirm the frontend health check call succeeds inside the composed environment

---

## 5. Pre-commit hooks

- [ ] Create `.pre-commit-config.yaml` at the repo root with the following hooks:
  - **Python:** `ruff` for linting, `black` for formatting
  - **Frontend:** `prettier` for formatting (via a local script hook)
  - **General:** `trailing-whitespace`, `end-of-file-fixer`, `check-yaml`
- [ ] Install linting dependencies: `pip install ruff black` and freeze with `pip freeze > requirements.txt`
- [ ] Run `pre-commit install` to activate hooks
- [ ] Run `pre-commit run --all-files` and fix any initial violations

---

## Acceptance criteria

- `docker compose up` starts both services with no errors
- `GET http://localhost:8000/health` returns `{ "status": "ok" }`
- The Vue app loads in the browser at `http://localhost:5173` and the health check call succeeds (visible in browser devtools network tab)
- Committing a file with a trailing whitespace or formatting violation is blocked by pre-commit
