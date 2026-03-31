# Phase 3 — Assignment Setup

Goal: a TA can create assignments within a course, define questions, and assign grading criteria to each question.

---

## 1. Backend — Models & migrations

- [ ] Create `backend/models/assignment.py` — `id`, `title`, `course_id` (FK)
- [ ] Create `backend/models/question.py` — `id`, `question_text`, `description`, `assignment_id` (FK)
- [ ] Create `backend/models/criterion.py` — `id`, `name`, `description`, `total_points`
- [ ] Create `backend/models/question_criterion.py` — `id`, `question_id` (FK), `criterion_id` (FK)
- [ ] Run Alembic migration

---

## 2. Backend — Assignment endpoints

- [ ] `GET /courses/{course_id}/assignments` — list assignments for a course
- [ ] `POST /courses/{course_id}/assignments` — create an assignment
- [ ] `GET /assignments/{id}` — get a single assignment
- [ ] `DELETE /assignments/{id}` — delete an assignment

---

## 3. Backend — Question endpoints

- [ ] `GET /assignments/{assignment_id}/questions` — list questions for an assignment
- [ ] `POST /assignments/{assignment_id}/questions` — create a question
- [ ] `PUT /questions/{id}` — update a question
- [ ] `DELETE /questions/{id}` — delete a question

---

## 4. Backend — Criterion endpoints

- [ ] `GET /criteria` — list all criteria
- [ ] `POST /criteria` — create a criterion
- [ ] `PUT /criteria/{id}` — update a criterion
- [ ] `DELETE /criteria/{id}` — delete a criterion
- [ ] `GET /questions/{question_id}/criteria` — list criteria linked to a question
- [ ] `POST /questions/{question_id}/criteria/{criterion_id}` — link a criterion to a question
- [ ] `DELETE /questions/{question_id}/criteria/{criterion_id}` — unlink a criterion from a question

---

## 5. Frontend — AssignmentView

- [ ] Implement `AssignmentView.vue` — lists questions for the current assignment
- [ ] "Create Question" button navigates to QuestionView (create mode)
- [ ] Each question row navigates to QuestionView (edit mode)

---

## 6. Frontend — QuestionView

- [ ] Implement `QuestionView.vue` — question title + description form
- [ ] Criteria section: dropdown of available criteria + "Add" button to link
- [ ] "Create Criterion" button navigates to CriterionView
- [ ] Linked criteria list with a remove button per row
- [ ] Clicking a linked criterion navigates to CriterionView (edit mode)

---

## 7. Frontend — CriterionView

- [ ] Implement `CriterionView.vue` — title, description, total points form
- [ ] Supports create mode (no existing criterion) and edit mode (pre-filled from selected criterion)
- [ ] On save, returns to QuestionView

---

## Acceptance criteria

- TA can create an assignment inside a course and see it in CourseView
- TA can create questions inside an assignment
- TA can create criteria and link them to a question
- TA can edit a linked criterion and see the changes reflected
- TA can unlink a criterion from a question without deleting it globally
