# Agent Prompts

## Application Overview

GradeKit is a local-first web application for Teaching Assistants to grade student assignments using rubric-based criteria. Refer to `README.md` for the full product spec and flows.

### Main entrypoints

- **Frontend:** `frontend/` — Vue 3 + TypeScript, entry at `frontend/src/main.ts`, app shell at `frontend/src/views/AppWrapper.vue`
- **Backend:** `backend/` — Python + FastAPI, entry at `backend/main.py`
- **Dev environment:** `docker-compose.yml` at the repo root — runs both services together

### Key user flows

1. **Authentication** — Register / Login before accessing anything else
2. **Setup** — Create course → add students → create assignment → create questions → assign criteria
3. **Grading** — Select assignment → select student → score criteria per question → finalize
4. **Export** — Generate a report PDF per student for a finalized assignment

---


## UI Design

When designing or implementing UI components, refer to `DESIGN.md` for the visual language of this project.
