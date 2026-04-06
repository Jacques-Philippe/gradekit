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
- [x] Unit tests for `TopBar.vue` (`TopBar.test.ts`)
  - Renders the "GradeKit" brand name
  - Avatar button shows the uppercased first letter of the logged-in username
  - Clicking the avatar opens the dropdown
  - Dropdown is not visible before the avatar is clicked
  - Clicking "Logout" calls `authStore.logout` and navigates to Login
  - Clicking outside the dropdown closes it

---

## 5. Frontend — HomeView

### Global search bar

- [x] Prominent search input at the top of the page
- [x] As the TA types, results appear inline below the input — matching courses and assignments grouped by type
- [x] Clicking a course result navigates to CourseView; clicking an assignment result navigates to AssignmentView (placeholder route for now)
- [x] Results are cleared when the input is emptied or focus is lost

### Recently worked-on courses

- [x] On mount, fetch `GET /courses` and `GET /activity` (see section 9); derive the 5 most recently worked-on courses by finding the latest activity event per course, sorted by `created_at` descending
- [x] Each card shows the course name and navigates to CourseView on click
- [x] Cards use the `DESIGN.md` style (white, `~8px` radius, subtle border and box shadow)
- [x] "Create Course" button above or alongside the list — inline form or modal to enter course name; on success re-fetches the list

### Recent activity feed

- [x] On mount, fetch `GET /activity` and render events as a chronological list, most recent first
- [x] Each item shows the event message and a human-readable relative timestamp (e.g. "2 hours ago")
- [x] Shows a placeholder message when there are no events yet

### Incoming deadlines

- [x] On mount, fetch `GET /deadlines` and render as a list sorted by `due_date` ascending
- [x] Each item shows the assignment title, course name, and formatted due date
- [x] Shows a placeholder message when there are no upcoming deadlines
- [x] Deadlines within 24 hours are visually highlighted (e.g. red or amber text)

---

## 6. Frontend — CourseView

- [x] Implement `CourseView.vue` — shows course name, students section, assignments section (assignments list placeholder for Phase 3)
- [x] Students section lists enrolled students
- [x] "Add Student" button navigates to CourseStudentsView
- [x] "Import CSV" button navigates to CourseStudentsView (import tab)

---

## 7. Frontend — CourseStudentsView

- [x] Implement `CourseStudentsView.vue` with two modes:
  - **Manual:** full name field + add button → calls `POST /courses/{id}/students`
  - **Import:** file input for CSV → preview parsed names → confirm → calls `POST /courses/{id}/students/import`
- [x] Show the current enrolled student list, with a remove button per row
- [ ] Add a confirmation modal before deleting a student

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

## 9. Backend — Activity feed

A lightweight audit log that records user-scoped events as they happen. Later phases will add more event types (grading, assignment creation); phase 2 covers course and student events.

### Model & migration

- [x] Create `backend/models/activity.py` with the following fields:
  - `id`
  - `user_id` (FK to user)
  - `event_type` — SQLAlchemy `Enum` (e.g. `COURSE_CREATED`, `STUDENT_ADDED`, `STUDENT_REMOVED`, `STUDENTS_IMPORTED`)
  - `payload` — `Text` column storing a JSON-serialised dict of context data (e.g. `{"course_id": 1, "course_name": "CS101", "student_name": "Jane Doe"}`); schema is event-type-specific and intentionally untyped at the DB level
  - `created_at` (datetime, default `utcnow`)
- [x] Create `backend/models/activity_type.py` — Python `Enum` class defining all valid `event_type` values; import this wherever events are recorded to avoid magic strings
- [x] Run Alembic migration to create the `activity` table

### Recording events

Wire event recording into the existing write endpoints (fire-and-forget — a failure to record must never fail the main operation):

- [x] `POST /courses` — record `COURSE_CREATED` with `{ course_id, course_name }`
- [x] `POST /courses/{course_id}/students` — record `STUDENT_ADDED` with `{ course_id, course_name, student_id, student_name }`
- [x] `POST /courses/{course_id}/students/import` — record `STUDENTS_IMPORTED` with `{ course_id, course_name, students: [{ student_id, student_name }] }` (one event for the whole import, not one per row)
- [x] `DELETE /courses/{course_id}/students/{student_id}` — record `STUDENT_REMOVED` with `{ course_id, course_name, student_id, student_name }`

### Endpoint

- [x] `GET /activity` — returns the 20 most recent activity events for the authenticated user, ordered most recent first
  - Response shape: `[{ id, event_type, payload, created_at }]`
  - Optional `?event_type=` query parameter to filter by type
  - Requires authentication

### Tests (`backend/tests/test_activity.py`)

- [x] Creating a course records a `COURSE_CREATED` event with the correct payload
- [x] Adding a student records a `STUDENT_ADDED` event with the correct payload
- [x] Importing students records a single `STUDENTS_IMPORTED` event with the list of imported students in the payload
- [x] Removing a student records a `STUDENT_REMOVED` event with the correct payload
- [x] `GET /activity` returns events in reverse chronological order
- [x] `GET /activity` only returns the authenticated user's events (not other users')
- [x] `GET /activity` returns at most 20 events
- [x] `GET /activity` requires authentication

---

## 10. Backend — Assignment deadline field

Assignments are fully implemented in Phase 3, but the `due_date` field is planned here so the HomeView deadlines panel has data to work with from the start.

### Model

- [x] Create `backend/models/assignment.py` with `id`, `title`, `course_id` (FK), and `due_date: Mapped[datetime | None]` — nullable ISO 8601 datetime, optional at creation time
- [x] Register `models.assignment` in `alembic/env.py`
- [x] Run Alembic migration to create the `assignments` table

### Endpoint

- [x] `GET /deadlines` — returns all upcoming assignments (where `due_date >= now`) across all courses owned by the authenticated user, ordered by `due_date` ascending (most urgent first)
  - Response shape: `[{ assignment_id, assignment_title, course_id, course_name, due_date }]`
  - Excludes assignments with no `due_date` set
  - Requires authentication

### Tests (`backend/tests/test_deadlines.py`)

- [x] Returns assignments ordered by `due_date` ascending
- [x] Excludes assignments with no `due_date`
- [x] Excludes assignments whose `due_date` is in the past
- [x] Only returns deadlines for the authenticated user's courses
- [x] Returns an empty list when no upcoming deadlines exist
- [x] Requires authentication

---

## 12. Internationalisation (i18n)

Use `vue-i18n` to extract all user-visible strings from the frontend into locale message files.

- [x] Install `vue-i18n` and register it on the Vue app in `main.ts`
- [x] Create `frontend/src/locales/en.json` — English locale file containing all strings
- [x] Create `frontend/src/i18n.ts` — initialises and exports the `i18n` instance (default locale `en`, fallback locale `en`)
- [x] Replace hard-coded strings in `LoginView.vue` and `RegisterView.vue` with `t()` calls
- [x] Replace hard-coded strings in `TopBar.vue` with `t()` calls
- [x] Replace hard-coded strings in `HomeView.vue` with `t()` calls (once implemented in section 5)
- [x] Replace hard-coded strings in `CourseView.vue` with `t()` calls (once implemented in section 6)
- [x] Replace hard-coded strings in `CourseStudentsView.vue` with `t()` calls (once implemented in section 7)
- [x] Also localize the error messages coming from the backend
- [x] User is able to switch languages through a languages modal which is accessed by clicking a Languages button in the dropdown accessible via avatar click in the topbar.

## 13. Sidebar
- [x] Define persistent sidebar in HomeView with items Dashboard, My Courses, and Settings
- [x] Sidebar should be visible only for desktop. Mobile should have a bottom bar

## 14. My Courses
- [x] at the moment we have no way to specify a deadline date or description to a course when we create one, and clicking "the create new course" button creates a new form input under "Recently worked on" which looks pretty janky.
  - [x] Let's begin by determining a form with more inputs for due date and description, both optional.
  - [x] Separate the course creation form from the "Recently worked on", specifically it should be above this section.
- [x] Evaluate the necessity of a My Courses sidebar option, given the user can search for any course from the Dashboard. I find it would be a better spot for course creation than the Dashboard. The conclusion of this investigation is that we want to have a dedicated page for My Courses where we can see all of a TA's courses. We can filter for a given course as well as create a new one.
- [x] Define `/courses/` page (`MyCoursesView.vue`) with:
  - [x] Page header "My Courses"
  - [x] Text search bar that filters the course table in real time across name and description simultaneously
  - [x] "Due before" date input that filters the table to courses whose due date is on or before the selected date (optional — clearing it removes the filter)
  - [x] Table listing all courses — columns: Name, Description, Due date, and an Actions column with a "View" button (navigates to `CourseView`) and a "Delete" button; clicking Delete opens a confirmation modal before proceeding
  - [x] "New Course" button in the header area — opens a modal containing the course form (name, optional description, optional due date); on success the modal closes and the new course appears in the table
  - [x] Empty state message when the TA has no courses yet
- [x] Wire the "My Courses" sidebar item to `/courses/` (currently points to `/`)
- [x] Remove course creation form from `HomeView` — the "Recently worked on" section remains, but the "+ New Course" button and form are gone

### Issues
- Given I created a new course with a deadline today, I'm not seeing it added to the upcoming deadlines shown on the Dashboard
- I'm able to create courses with the same name, maybe this shouldn't be allowed
- I should be able to edit a course
- Running the unit tests with the docker instance running adds to the actual database from the tests. This probably shouldn't happen.

---

## Acceptance criteria

- TA can create a course and see it on HomeView
- Search bar on HomeView filters the course list in real time
- TA can add a student manually and see them in the enrolled list
- TA can upload a CSV and see a preview before confirming import
- After import, all valid rows appear in the enrolled list
- TA can remove a student from a course
- Login and Register pages are visually consistent with the app design system
- Application is internationalized and can easily add new languages
- TA can switch languages via language modal
- Top bar is defined
- Side bar is defined
