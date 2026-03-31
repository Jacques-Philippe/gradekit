# Phase 4 — Grading

Goal: a TA can open a student's submission, score each criterion per question, leave notes, and finalize the grade.

---

## 1. Backend — Models & migrations

- [ ] Create `backend/models/submission.py` — `id`, `assignment_id` (FK), `student_id` (FK), `pdf_path` (file path on disk)
- [ ] Create `backend/models/graded_question_criterion.py` — `id`, `submission_id` (FK), `question_id` (FK), `criterion_id` (FK), `score`, `notes`
- [ ] Run Alembic migration

---

## 2. Backend — Submission endpoints

- [ ] `GET /assignments/{assignment_id}/submissions` — list all submissions for an assignment, including grading status per student
- [ ] `POST /assignments/{assignment_id}/submissions/{student_id}` — create a submission record for a student
- [ ] `POST /submissions/{id}/upload` — upload the student's assignment PDF; store on disk and save path
- [ ] `GET /submissions/{id}/pdf` — serve the submission PDF file

---

## 3. Backend — Grading endpoints

- [ ] `GET /submissions/{submission_id}/grades` — list all graded question criteria for a submission
- [ ] `PUT /submissions/{submission_id}/questions/{question_id}/criteria/{criterion_id}` — upsert score and notes for a criterion on a question
- [ ] `POST /submissions/{submission_id}/finalize` — mark the submission as graded

---

## 4. Frontend — GradeAssignmentView

- [ ] Implement `GradeAssignmentView.vue` — lists all student submissions with graded / not graded status
- [ ] "Keep Grading" button navigates to the first ungraded submission
- [ ] Each row navigates to GradeSubmissionView for that student

---

## 5. Frontend — GradeSubmissionView

- [ ] Implement `GradeSubmissionView.vue` with a three-area layout:
  - **Question selector:** list of all questions for the assignment
    - Active question is highlighted with an accent border or background
    - Graded questions show a checkmark; ungraded questions are visually distinct (e.g. muted, hollow indicator)
    - On mount, automatically select the first ungraded question
    - Clicking a question makes it active
  - **Left panel:** PDF viewer rendering the student's submission (`GET /submissions/{id}/pdf`)
    - Clicking the PDF drops an annotation marker linked to the active question
  - **Right panel:** grading panel for the active question
    - Criteria list with score inputs (clamped to 0 – criterion total_points)
    - Notes textarea
- [ ] Live running total updates as scores are entered
- [ ] Autosave — debounce score and note changes, fire save 1–2 seconds after the TA stops typing; show a brief "Saved" indicator after each successful save
- [ ] Undo — maintain an in-session undo stack for score and note changes (Ctrl+Z); number inputs need explicit undo handling since browsers do not reliably support Ctrl+Z on them
- [ ] Clear the undo stack when the submission is finalized or the user navigates away
- [ ] "Finalize" button calls `POST /submissions/{id}/finalize`, then navigates back to GradeAssignmentView

---

## Acceptance criteria

- GradeAssignmentView shows graded vs ungraded status per student
- "Keep Grading" skips already-graded students
- PDF viewer loads and displays the student's submission
- TA can enter a score for each criterion and see the running total update
- TA can leave a note per question
- Scores and notes persist after navigating away and back
- Finalizing a submission marks it as graded in GradeAssignmentView
