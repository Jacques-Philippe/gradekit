# Phase 5 — Export

Goal: a TA can generate a report PDF per student for a finalized assignment.

---

## 1. Backend — PDF generation

- [ ] Install PDF library: `pip install reportlab` (or `weasyprint`) and freeze
- [ ] Create `backend/services/report.py` with a `generate_report(submission_id)` function that:
  - Fetches the submission, student, assignment, questions, criteria, and all graded question criteria
  - Takes the original submission PDF
  - Appends a feedback section after the submission content with:
    - Student name and assignment title
    - Per-question breakdown: question text, each criterion with score awarded / total points, and notes
    - Overall total score / total possible points
  - Writes the combined PDF to disk and returns the file path
- [ ] `POST /assignments/{assignment_id}/export` — triggers report generation for all finalized submissions; returns a list of download URLs
- [ ] `GET /reports/{filename}` — serves a generated report PDF

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
