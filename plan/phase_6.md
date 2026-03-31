# Phase 6 — Polish

Goal: the application handles edge cases gracefully and feels complete to use end-to-end.

---

## 1. Error handling

- [ ] All API errors surface a readable message in the UI (not a raw status code)
- [ ] Network failures (backend unreachable) show a consistent error state
- [ ] Form validation errors are shown inline next to the relevant field
- [ ] 401 responses anywhere in the app clear the session and redirect to LoginView

---

## 2. Loading states

- [ ] All data-fetching actions show a loading spinner or skeleton while in flight
- [ ] Buttons that trigger async actions are disabled and show a loading indicator while pending
- [ ] PDF viewer shows a loading state while the file is being fetched

---

## 3. Empty states

- [ ] HomeView: no courses yet — prompt to create the first course
- [ ] CourseView: no students — prompt to add or import students
- [ ] CourseView: no assignments — prompt to create the first assignment
- [ ] AssignmentView: no questions — prompt to create the first question
- [ ] GradeAssignmentView: no submissions — prompt to upload student PDFs
- [ ] ExportView: no finalized submissions — explain that submissions must be finalized first

---

## 4. Confirmation dialogs

- [ ] Deleting a course, assignment, question, or criterion prompts a confirmation dialog
- [ ] Finalizing a submission prompts confirmation (action is not easily reversible)

---

## 5. UX hardening

- [ ] Back navigation never leaves the user on a broken state (e.g. navigating back after deletion)
- [ ] Search on HomeView is debounced
- [ ] CSV import preview clearly marks rows that failed to parse
- [ ] Score inputs in GradeSubmissionView clamp to 0 – criterion total_points range
- [ ] "Keep Grading" on GradeAssignmentView is hidden or disabled when all submissions are finalized

---

## Acceptance criteria

- No user-visible action results in a blank screen or unhandled error
- All destructive actions require confirmation
- Every list view has a meaningful empty state
- All async actions show feedback while in progress
