# Phase 2 — Course & Student Management

Goal: a TA can create courses, add students manually or via CSV import, and view enrolled students.

---

## 1. Backend — Models & migrations

- [ ] Create `backend/models/course.py` — `id`, `name`, `owner_id` (FK to user)
- [ ] Create `backend/models/student.py` — `id`, `full_name`
- [ ] Create `backend/models/enrollment.py` — `id`, `course_id` (FK), `student_id` (FK)
- [ ] Run Alembic migration to create `courses`, `students`, `enrollments` tables

---

## 2. Backend — Course endpoints

- [ ] `GET /courses` — list all courses for the authenticated user
- [ ] `POST /courses` — create a course
- [ ] `GET /courses/{id}` — get a single course
- [ ] `DELETE /courses/{id}` — delete a course

---

## 3. Backend — Student endpoints

- [ ] `GET /courses/{course_id}/students` — list enrolled students for a course
- [ ] `POST /courses/{course_id}/students` — create and enroll a student in one step
- [ ] `DELETE /courses/{course_id}/students/{student_id}` — remove a student from a course
- [ ] `POST /courses/{course_id}/students/import` — accepts a CSV file, bulk-creates and enrolls students; returns list of created students and any rows that failed to parse

---

## 4. Frontend — HomeView

- [ ] Implement `HomeView.vue` — fetches and lists all courses on mount
- [ ] Inline search bar that filters the course list by name
- [ ] "Create Course" button — inline form or modal to enter course name
- [ ] Each course row navigates to CourseView
- [ ] Logout button calls `authStore.logout`

---

## 5. Frontend — CourseView

- [ ] Implement `CourseView.vue` — shows course name, students section, assignments section (assignments list placeholder for Phase 3)
- [ ] Students section lists enrolled students
- [ ] "Add Student" button navigates to CourseStudentsView
- [ ] "Import CSV" button navigates to CourseStudentsView (import tab)

---

## 6. Frontend — CourseStudentsView

- [ ] Implement `CourseStudentsView.vue` with two modes:
  - **Manual:** full name field + add button → calls `POST /courses/{id}/students`
  - **Import:** file input for CSV → preview parsed names → confirm → calls `POST /courses/{id}/students/import`
- [ ] Show the current enrolled student list, with a remove button per row

---

## Acceptance criteria

- TA can create a course and see it on HomeView
- Search bar on HomeView filters the course list in real time
- TA can add a student manually and see them in the enrolled list
- TA can upload a CSV and see a preview before confirming import
- After import, all valid rows appear in the enrolled list
- TA can remove a student from a course
