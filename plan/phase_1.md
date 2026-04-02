# Phase 1 — Authentication

Goal: a TA can register an account, log in, and stay logged in across browser sessions. All other routes are protected.

---

## 1. Backend — Database setup

- [x] Install SQLAlchemy and database dependencies: `pip install sqlalchemy alembic` and freeze
- [x] Create `backend/database.py` with SQLite connection and session setup
- [x] Create `backend/models/user.py` with a `User` model: `id`, `username`, `hashed_password`
- [x] Run initial Alembic migration to create the `users` table

---

## 2. Backend — Auth endpoints

- [x] Install auth dependencies: `pip install passlib[bcrypt] python-jose[cryptography]` and freeze
- [x] `POST /auth/register` — accepts `username` + `password`, hashes password, creates user, returns JWT
- [x] `POST /auth/login` — verifies credentials, returns JWT on success, 401 on failure
- [x] `GET /auth/me` — protected endpoint, returns current user from JWT (used to validate persisted token on frontend load)
- [ ] Write unit tests for auth endpoints:
  - `POST /auth/register` — succeeds with valid credentials, returns a token
  - `POST /auth/register` — fails with 400 if username is already taken
  - `POST /auth/login` — succeeds with correct credentials, returns a token
  - `POST /auth/login` — fails with 401 if username does not exist
  - `POST /auth/login` — fails with 401 if password is wrong
  - `GET /auth/me` — returns current user when a valid token is provided
  - `GET /auth/me` — fails with 401 when no token is provided
  - `GET /auth/me` — fails with 401 when token is expired or invalid

---

## 3. Frontend — Auth store & session persistence

- [ ] Create `authStore.ts` — state: `token`, `user`; actions: `login`, `register`, `logout`, `restoreSession`
- [ ] Persist `token` to `localStorage` so sessions survive page refreshes
- [ ] On app load, if a token exists in `localStorage`, call `GET /auth/me` to validate it — if invalid, clear token and redirect to LoginView
- [ ] Attach `Authorization: Bearer <token>` header to all API requests
- [ ] Write unit tests for `authStore`:
  - `login` — sets `token` and `user` on success
  - `login` — sets `error` and leaves `token` null on failure
  - `register` — sets `token` and `user` on success
  - `register` — sets `error` and leaves `token` null on failure
  - `logout` — clears `token`, `user`, and removes token from `localStorage`
  - `restoreSession` — sets `user` when a valid token exists in `localStorage`
  - `restoreSession` — clears token and `user` when the stored token is invalid

---

## 4. Frontend — Auth views

- [ ] Create `LoginView.vue` — username + password form, calls `POST /auth/login`, navigates to HomeView on success; displays error message on 401
- [ ] Create `RegisterView.vue` — username + password form, calls `POST /auth/register`, navigates to HomeView on success; displays error message on 400 (e.g. username taken)
- [ ] Link the two views to each other ("Don't have an account? Register")
- [ ] Error messages are shown inline below the form, cleared on the next submit attempt
- [ ] Write unit tests for `LoginView`:
  - Renders username and password fields and a submit button
  - Calls `authStore.login` with the entered credentials on submit
  - Navigates to HomeView when login succeeds
  - Displays an error message when login fails
  - Error message is cleared when the form is submitted again
  - Submit button is disabled while the request is in flight
- [ ] Write unit tests for `RegisterView`:
  - Renders username and password fields and a submit button
  - Calls `authStore.register` with the entered credentials on submit
  - Navigates to HomeView when registration succeeds
  - Displays an error message when registration fails (e.g. username taken)
  - Error message is cleared when the form is submitted again
  - Submit button is disabled while the request is in flight

---

## 5. Frontend — Route protection

- [ ] Add a navigation guard that redirects unauthenticated users to LoginView
- [ ] Redirect authenticated users away from LoginView and RegisterView to HomeView

---

## Acceptance criteria

- A new user can register and is immediately taken to HomeView
- A returning user can log in and is taken to HomeView
- Refreshing the page keeps the user logged in
- An invalid or expired token clears the session and redirects to LoginView
- Navigating to a protected route while logged out redirects to LoginView
- Logout clears the token and returns to LoginView
