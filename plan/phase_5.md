# Phase 5 — Export

Goal: a TA can generate a report PDF per student for a finalized assignment.

---

## 1. Backend — PDF generation with Typst

- [ ] Install Typst — add `typst` binary to the backend Docker image (or install via `pip install typst` if using the Python wrapper) and freeze
- [ ] Create `backend/templates/report.typ` — a Typst template that accepts structured grade data and renders:
  - Student name, assignment title, and date
  - Per-question breakdown: question text, each criterion with score awarded / total points, and notes
  - Overall total score / total possible points
- [ ] Add a `Report` model (`backend/models/report.py`) — `id` (opaque UUID), `submission_id` (FK), `file_path` (server-side only, never exposed to the client)
- [ ] Create `backend/services/report.py` with a `generate_report(submission_id)` function that:
  - Fetches the submission, student, assignment, questions, criteria, and all graded question criteria
  - Renders `report.typ` with the grade data via Typst CLI to produce a feedback PDF
  - Merges the original submission PDF (unmodified) with the generated feedback PDF using a PDF merge library (`pip install pypdf`)
  - Writes the merged PDF to a fixed server-side storage root — the original submission file is never modified
  - Creates a `Report` record mapping a new UUID to the output file path; returns the UUID
- [ ] `POST /assignments/{assignment_id}/export` — triggers report generation for all finalized submissions; guarded by `get_assignment_for_ta`; returns a list of `{ studentName, reportId }` objects (no file paths)
- [ ] `GET /reports/{report_id}` — serves a generated report PDF:
  - Accepts only a UUID-shaped `report_id`; reject any input that is not a valid UUID with 400
  - Looks up the `Report` record by ID — if not found, return 404
  - Verifies the authenticated TA owns the course the report's submission belongs to — if not, return 403
  - Resolves the file path exclusively from the database record; the `report_id` parameter is never used to construct a file path directly
  - Streams the file from the fixed storage root

---

## 2. Frontend — ExportView

- [ ] Implement `ExportView.vue`:
  - Shows assignment name, total students, and how many are finalized
  - "Generate Reports" button — calls `POST /assignments/{id}/export`, disables during generation
  - After generation, displays a list of student names each with a download link to their report PDF
- [ ] Warn if not all submissions are finalized before generating

---

## Acceptance criteria

- "Generate Reports" produces one PDF per finalized submission
- Each report PDF contains the original submission followed by a feedback section
- The feedback section includes per-question scores and notes
- The overall total score is shown on the report
- Download links open or download the correct student's report
- Unfinalized submissions are excluded from export with a visible warning
