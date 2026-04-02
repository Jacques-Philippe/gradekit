# Overview

This directory contains the server responsible for serving content to the frontend application

# Run the server

1. (first run only) Install the dev environment
   ```bash
   cd backend
   python -m venv .venv
   . .venv/bin/activate
   pip install -r requirements.txt
   ```
1. Serve with hot reload
   ```bash
   uvicorn main:app --reload
   ```

# Database migrations (Alembic)

All commands must be run from the `backend/` directory with the venv activated.

### Create a new migration after changing a model

```bash
alembic revision --autogenerate -m "describe your change"
```

### Apply all pending migrations

```bash
alembic upgrade head
```

### Roll back one migration

```bash
alembic downgrade -1
```

### Migration history

```bash
alembic history
```

### Initial migration (already applied)

```bash
alembic revision --autogenerate -m "create users table"
alembic upgrade head
```
