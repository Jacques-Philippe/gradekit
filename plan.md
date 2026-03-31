# GradeKit — View Plan

## Authentication

### LoginView

Entry point for returning users.

- Username and password fields
- Submit button — issues session token on success, navigates to HomeView
- Link to RegisterView

### RegisterView

Account creation for first-time setup.

- Username and password fields
- Submit button — creates account and logs in automatically, navigates to HomeView

---

## Home

### HomeView

Landing page after login. Entry point to the two main workflows: setup and grading.

- Search bar (inline, above the course list) — filters visible courses and assignments by name
- List of courses
- Button to create a new course
- Logout button

---

## Setup

### CourseView

Detail view for a single course.

- Course name
- Students section: list of enrolled students, add student button, import CSV button
- Assignments section: list of assignments, create assignment button

### CourseStudentsView

Manage students enrolled in the current course. Two flows in one view:

- **Manual:** full name field and add button to create and enroll one student at a time
- **Import:** file upload input for a CSV roster, preview of parsed names, confirm import button

### AssignmentView

Detail view for a single assignment.

- Assignment title
- List of questions, create question button

### QuestionView

Create or edit a question within an assignment.

- Question title and description fields
- List of criteria assigned to this question
- Add criterion from dropdown (existing criteria)
- Create new criterion button → navigates to CriterionView

### CriterionView

Create or edit a grading criterion.

- Criterion title, description, and total points fields
- Submit button

---

## Grading

### GradeAssignmentView

Entry point for grading a specific assignment. Shows all student submissions.

- List of students with submission status (graded / not graded)
- Keep Grading button — navigates to the next ungraded student
- Each row navigates to GradeSubmissionView for that student

### GradeSubmissionView

Main grading screen for one student's submission. Split layout:

- **Question selector** (top or left sidebar) — lists all questions for the assignment
  - The active question is visually highlighted (e.g. bold text, accent border, filled indicator)
  - Graded questions show a completion indicator (e.g. checkmark); ungraded questions are visually distinct
  - On load, the first ungraded question is automatically selected
  - The TA can click any question to switch to it at any time
- **PDF viewer** (left panel) — shows the student's submitted assignment
  - Clicking on the PDF drops an annotation marker tagged to the currently active question
  - On export, all annotation markers and feedback are appended per question at the end of the PDF
- **Grading panel** (right panel) — context for the active question
  - List of criteria with score inputs (0 to criterion total_points)
  - Optional notes field for written feedback
- Live score summary (running total) shown at the bottom
- **Autosave** — scores and notes are saved automatically after the TA stops typing (debounced); a subtle "Saved" indicator confirms the save
- **Undo** — Ctrl+Z undoes score and note changes within the current session; undo history is cleared on finalization or when the session ends
- Finalize button — saves grades and returns to GradeAssignmentView

---

## Export

### ExportView

Trigger report generation for a completed assignment.

- Assignment summary (total students, graded count)
- Generate Reports button — produces one PDF per student
- Download links for individual student reports once generated
