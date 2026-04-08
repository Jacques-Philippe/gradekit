## GradeKit

## Purpose

A local-first, web-based grading application designed to help university Teaching Assistants grade assignments faster, more consistently, and with less mental overhead.

### Key Principles

- Local-first: runs on the TA’s own machine
- Simple setup: local accounts only — no SSO, no university IT involvement
- Focused scope: grading only, not a full LMS
- Opinionated UX: optimized for the grading workflow

## Flow

### Authentication

GradeKit uses local accounts to protect the TA's data. There are no external identity providers — credentials are stored and verified on the local machine.

#### Register

1. Navigate to the Register screen
2. Enter a username and password
3. Submit — the account is created and the user is logged in automatically

#### Login

1. Navigate to the Login screen
2. Enter username and password
3. On success, a session token is issued and persisted — the user remains logged in across browser sessions until they explicitly log out

#### Logout

1. Select Logout from the app
2. The session token is cleared — the user is returned to the Login screen

### Setup

1. Create courses
2. Add students to a course — two supported flows:
   - **Option A (manual):** Create students one at a time directly inside the course
   - **Option B (import):** Upload a CSV roster to bulk-create and enroll students in one step
3. Create assignment
4. Create questions
5. Assign/Create criteria for each question

### Grading

1. Select course
1. Select assignment
1. Select next student to grade — the student's submitted assignment PDF is displayed in a viewer
1. For each question
   1. Apply criteria scores
   1. Leave a note on the question — the TA types feedback while referring to the PDF
1. Finalize grading for student
1. Continue to next student
1. (For all grading complete) Finalize grading for assignment

### Export

1. Generate a report PDF per student
   - Includes a modified version of the original submission PDF
   - Each question's notes are appended as a feedback section
   - Total score and per-question breakdown are included

## On grading criteria

For each assignment question, the TA can define a list of grading criteria.

For a TA, grading is a mix of:

1. **Judgment**
   “Did this satisfy the criterion?”

2. **Scoring**
   “How many points does that deserve?”

3. **Communication**
   “How do I explain this efficiently and fairly?”

## What the TA actually does, step by step

### For one student, one assignment:

1. TA selects the student
2. The rubric is shown as a list of criteria
3. For each criterion:
   - TA selects a score
   - Default feedback auto-fills

4. TA optionally:
   - Edits feedback
   - Adds a general comment

5. The app:
   - Calculates total score
   - Shows a live summary

6. TA saves and moves to the next student

## Technology

- Frontend: Vue.js (Vue 3 + TypeScript)
- Backend: Python (FastAPI)
- Database: SQLite
- Deployment: single local instance, self-hosted

## Application Structure

GradeKit is split into five services that run together via Docker Compose.

**Frontend (`frontend/`)** is a Vue 3 + TypeScript single-page application built with Vite. It uses the Composition API throughout, Pinia for state management, and Vue Router for client-side navigation. The frontend communicates with the backend exclusively through a JSON REST API, proxied via Vite's dev server during development.

**Backend (`backend/`)** is a Python server built with FastAPI. It exposes a REST API consumed by the frontend, handles authentication via JWT bearer tokens, and persists all data to a local SQLite database using SQLAlchemy as the ORM. Database migrations are managed with Alembic. Long-running jobs (PDF generation) are offloaded to the worker by enqueuing tasks via Redis.

**PDF Generator Worker (`pdf-worker/`)** is a Python worker process built with [`arq`](https://arq-docs.helpmanual.io/). `arq` was chosen over Celery for its async-native design (matching FastAPI's async model), simpler API, and built-in Redis job status tracking — Celery's additional features (multiple broker support, complex task graphs) are not needed for this use case. The worker listens for jobs on Redis and executes them asynchronously — generating student report PDFs using Typst. The API returns a job ID immediately; the frontend polls `GET /jobs/{id}` to check status and retrieve the result.

**Redis** acts as the message broker between the backend and the worker. Job payloads and status are stored in Redis; no separate job table is needed in SQLite.

**ML Service (`ml-service/`)** is a small Python FastAPI service that provides AI-assisted features during grading. It is called by the backend over HTTP — the frontend never communicates with it directly. It uses [`sentence-transformers`](https://www.sbert.net/) with the `all-MiniLM-L6-v2` model to embed and compare text, running on CPU with no GPU required.

- **Feedback autocomplete** (`POST /ml/suggest-feedback`) — given a partial comment and criterion context, returns the top 3 semantically similar comments the TA has previously written for that criterion, to speed up repetitive feedback.

## Developer Get Started

### Docker-compose install

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. Clone the repo
1. Create the backend environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Then open `backend/.env` and set a secure value for `SECRET_KEY`.
1. Create the frontend environment file:
   ```bash
   cp frontend/.env.example frontend/.env.development
   ```
1. Start both services:
   ```bash
   docker compose up --build --remove-orphans
   ```
1. The app is available at `http://localhost:5173/gradekit/`
1. The backend API is available at `http://localhost:8000`

You can stop the service with
```bash
docker compose down
```

### Standalone install

1. Clone the repo
1. Install the requirements for the python virtual environment
   ```bash
   python -m venv .venv
   . .venv/Scripts/Activate # Windows
   source .venv/bin/activate # macOS / Linux
   pip install -r requirements.txt
   ```
1. Activate pre-commit hooks
   ```bash
   python -m pre_commit install
   ```
