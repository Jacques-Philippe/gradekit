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

## 6. Settings

A per-user settings system for configuring app behaviour.

### Backend

- [ ] Create `backend/models/user_settings.py` — `id`, `user_id` (FK, unique), `deadline_reminders_enabled` (bool, default `true`), `reminder_threshold_hours` (int, default `48`), `reminder_snooze_hours` (int, default `24`)
- [ ] Run Alembic migration to create `user_settings` table
- [ ] `GET /settings` — return the authenticated user's settings (auto-create with defaults on first access)
- [ ] `PATCH /settings` — partial update of settings fields

### Frontend

- [ ] Create `SettingsView.vue` — accessible from TopBar avatar dropdown
- [ ] Toggle to enable/disable deadline reminders
- [ ] Selector for reminder threshold: 24h, 48h, or both
- [ ] Selector for snooze duration (default 24h)
- [ ] Persists via `PATCH /settings`

---

## 7. Deadline reminder modal

Surfaces a proactive nudge when assignments are due soon, using the `GET /deadlines` endpoint from Phase 2.

### Logic

- [ ] On app load (in `AppWrapper.vue`), fetch `GET /deadlines` and check for deadlines within the user's configured threshold
- [ ] If found, check `localStorage` for `deadline_reminder_dismissed_at`; show modal only if absent or older than the configured snooze duration
- [ ] On dismiss, write `deadline_reminder_dismissed_at = now()` to `localStorage`

### Modal content

- [ ] Heading: "Deadlines coming up"
- [ ] Count summary: e.g. "2 assignments due within 24h, 1 more within 48h"
- [ ] Per-assignment rows: assignment title, course name, formatted due date, "Keep Grading" button
- [ ] "Keep Grading" reuses the same navigation as the existing "Keep Grading" button on `GradeAssignmentView` — routes to the next ungraded submission for that assignment
- [ ] "Dismiss" button closes the modal and records the dismissal timestamp

### Settings integration

- [ ] Modal respects `deadline_reminders_enabled` — skip entirely if disabled
- [ ] Modal respects `reminder_threshold_hours` — only show deadlines within that window
- [ ] Snooze duration uses `reminder_snooze_hours` from user settings

---

## Acceptance criteria

- No user-visible action results in a blank screen or unhandled error
- All destructive actions require confirmation
- Every list view has a meaningful empty state
- All async actions show feedback while in progress
- Deadline reminder modal appears on load when relevant deadlines exist and has not been recently dismissed
- Modal links directly to the next ungraded submission per assignment
- All reminder behaviour is configurable per user via SettingsView
