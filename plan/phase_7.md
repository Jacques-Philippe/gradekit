# Phase 7 — ML Service

Goal: augment the grading experience with AI-assisted features using a locally-running ML microservice.

---

## 1. Infrastructure — ML service

- [ ] Create `ml-service/` — small FastAPI app, runs as a fifth Docker Compose service
- [ ] Install `sentence-transformers` and load `all-MiniLM-L6-v2` model on startup
- [ ] Add `ml-service` to `docker-compose.yml`; backend calls it over HTTP, frontend never calls it directly

---

## 2. Feedback autocomplete

### Backend

- [ ] `POST /ml/suggest-feedback` — accepts `{ partial_text, criterion_id }`, queries past comments for that criterion, returns top 3 semantically similar suggestions
- [ ] Backend proxies this through to the ML service; result cached briefly to avoid redundant inference on rapid keystrokes

### Frontend

- [ ] Feedback fields in `GradeSubmissionView` send a request after 500ms debounce and 3+ characters typed
- [ ] Top suggestion rendered as inline ghost text in muted gray (`~#9ca3af`), same font and size as the input
- [ ] **Tab** accepts the suggestion; any other keystroke dismisses it
- [ ] Repeated **Tab** presses cycle through alternative suggestions, then wrap back to the TA's original text
- [ ] No ghost text shown when the TA has no prior history for the criterion (graceful degradation)
- [ ] Suggestions scoped to the same criterion across all assignments (not cross-criterion)

---

## Acceptance criteria

- Feedback autocomplete appears inline and never interrupts the TA's typing flow
- Ghost text is visually distinct but unobtrusive
- ML service failure degrades gracefully — autocomplete is silently disabled, grading continues normally
