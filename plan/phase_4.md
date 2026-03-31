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

- [ ] Implement `GradeSubmissionView.vue` with a split layout:
  - **Left panel:** PDF viewer rendering the student's submission (`GET /submissions/{id}/pdf`)
  - **Right panel:** per-question accordion or list
    - Each question shows its linked criteria with a score input (0 to criterion total_points)
    - Notes textarea per question
- [ ] Live running total updates as scores are entered
- [ ] Auto-save scores and notes on input (debounced) or explicit save button per question
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
