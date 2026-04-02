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

## Developer Get Started

### Docker-compose install

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. Clone the repo
1. Start both services:
   ```bash
   docker compose up
   ```
1. The app is available at `http://localhost:5173/gradekit/`
1. The backend API is available at `http://localhost:8000`

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
