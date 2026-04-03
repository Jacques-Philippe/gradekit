# Phase 2 — Course & Student Management

Goal: a TA can create courses, add students manually or via CSV import, and view enrolled students.

---

## 1. Backend — Models & migrations

- [x] Create `backend/models/course.py` — `id`, `name`, `description` (optional), `owner_id` (FK to user)
- [x] Create `backend/models/student.py` — `id`, `full_name`
- [x] Create `backend/models/enrollment.py` — `id`, `course_id` (FK), `student_id` (FK)
- [x] Run Alembic migration to create `courses`, `students`, `enrollments` tables

---

## 2. Backend — Course endpoints

All course endpoints require authentication via Bearer token (`Depends(get_current_user)`).

- [x] `GET /courses` — list all courses for the authenticated user
- [x] `POST /courses` — create a course
- [x] `GET /courses/{id}` — get a single course (must be owned by the authenticated user)
- [x] `DELETE /courses/{id}` — delete a course (must be owned by the authenticated user)

---

## 3. Backend — Student endpoints

- [x] `GET /courses/{course_id}/students` — list enrolled students for a course
- [x] `POST /courses/{course_id}/students` — create and enroll a student in one step
- [x] `DELETE /courses/{course_id}/students/{student_id}` — remove a student from a course
- [x] `POST /courses/{course_id}/students/import` — accepts a CSV file, bulk-creates and enrolls students; returns list of created students and any rows that failed to parse

---

## 4. Frontend — TopBar

The top bar is a persistent shell component rendered across all authenticated views via `AppWrapper.vue`.

- [x] Create `TopBar.vue` — full-width bar, fixed to the top
  - **Left:** product name "GradeKit" in bold
  - **Right:** logged-in username + "Logout" button that calls `authStore.logout` and navigates to Login
- [x] Mount `TopBar.vue` in `AppWrapper.vue` above the router view, visible only when authenticated (`authStore.token !== null`)
- [x] Style per `DESIGN.md`: dark navy background (`~#1a2844`), white text, consistent padding
- [x] Move the logout button out of `HomeView.vue` — it belongs in the top bar
- [x] Replace username + logout button with an avatar circle (top-right) showing the first letter of the logged-in username
  - Clicking the avatar opens a dropdown menu
  - Dropdown contains a "Logout" option that calls `authStore.logout` and navigates to Login
  - Dropdown closes when clicking outside

---

## 5. Frontend — HomeView

- [ ] Implement `HomeView.vue` — fetches and lists all courses on mount
- [ ] Inline search bar that filters the course list by name
- [ ] "Create Course" button — inline form or modal to enter course name
- [ ] Each course row navigates to CourseView

---

## 6. Frontend — CourseView

- [ ] Implement `CourseView.vue` — shows course name, students section, assignments section (assignments list placeholder for Phase 3)
- [ ] Students section lists enrolled students
- [ ] "Add Student" button navigates to CourseStudentsView
- [ ] "Import CSV" button navigates to CourseStudentsView (import tab)

---

## 7. Frontend — CourseStudentsView

- [ ] Implement `CourseStudentsView.vue` with two modes:
  - **Manual:** full name field + add button → calls `POST /courses/{id}/students`
  - **Import:** file input for CSV → preview parsed names → confirm → calls `POST /courses/{id}/students/import`
- [ ] Show the current enrolled student list, with a remove button per row

---

## 8. Frontend — Auth page polish

Style `LoginView.vue` and `RegisterView.vue` to match the visual language in `DESIGN.md`.

- [x] Center the form card on the page — white card, `~8px` border radius, subtle border and box shadow, on an off-white (`~#f5f6f8`) background
- [x] Add the "GradeKit" product name as a heading above the form
- [x] Style inputs: full width, bordered, `~8px` radius, comfortable padding
- [x] Style the submit button: dark navy (`~#1a2844`), white text, full width, `~8px` radius
- [x] Style inline error: red text below the submit button
- [x] Style the cross-link ("Already have an account? Login" / "Don't have an account? Register") in muted gray below the error
- [x] Disable the submit button and show a loading state while the request is in flight

---

## 9. Internationalisation (i18n)

Use `vue-i18n` to extract all user-visible strings from the frontend into locale message files.

- [ ] Install `vue-i18n` and register it on the Vue app in `main.ts`
- [ ] Create `frontend/src/locales/en.json` — English locale file containing all strings
- [ ] Create `frontend/src/i18n.ts` — initialises and exports the `i18n` instance (default locale `en`, fallback locale `en`)
- [ ] Replace hard-coded strings in `LoginView.vue` and `RegisterView.vue` with `t()` calls
- [ ] Replace hard-coded strings in `TopBar.vue` with `t()` calls
- [ ] Replace hard-coded strings in `HomeView.vue` with `t()` calls (once implemented in section 5)
- [ ] Replace hard-coded strings in `CourseView.vue` with `t()` calls (once implemented in section 6)
- [ ] Replace hard-coded strings in `CourseStudentsView.vue` with `t()` calls (once implemented in section 7)

---

## Acceptance criteria

- TA can create a course and see it on HomeView
- Search bar on HomeView filters the course list in real time
- TA can add a student manually and see them in the enrolled list
- TA can upload a CSV and see a preview before confirming import
- After import, all valid rows appear in the enrolled list
- TA can remove a student from a course
- Login and Register pages are visually consistent with the app design system
