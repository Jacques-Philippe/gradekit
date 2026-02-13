## GradeKit

## Purpose

A local-first, web-based grading application designed to help university Teaching Assistants grade assignments faster, more consistently, and with less mental overhead.

### Target User

A single TA grading one course during one semester.

#### Core Problem It Solves

- Rubric-based grading is slow and inconsistent in existing tools
- Repetitive feedback wastes time
- Grading decisions are hard to defend during disputes
- LMS tools are heavy, inflexible, or require institutional access

### Key Principles

- Local-first: runs on the TA’s own machine
- Simple setup: no accounts, no SSO, no university IT involvement
- Focused scope: grading only, not a full LMS
- Opinionated UX: optimized for the grading workflow

## Flow

### Setup

1. Create course
2. Add students
3. Create assignment
4. Create questions
5. Assign/Create criteria for each question

### Grading

1. Select course
1. Select assignment
1. Select next student to grade
1. For each question
   1. Add criteria fulfillment
   1. Add feedback
   1. Finalize grading for student
1. Continue to next student
1. (For all grading complete) Finalize grading for assignment

### Export

Export grades per assignment

## On grading criteria

For each assignment question, the TA can define a list of grading criteria.

For a TA, grading is a mix of:

1. **Judgment**
   “Did this satisfy the criterion?”

2. **Scoring**
   “How many points does that deserve?”

3. **Communication**
   “How do I explain this efficiently and fairly?”

## What the TA actually does, step by step

### For one student, one assignment:

1. TA selects the student
2. The rubric is shown as a list of criteria
3. For each criterion:
   - TA selects a score
   - Default feedback auto-fills

4. TA optionally:
   - Edits feedback
   - Adds a general comment

5. The app:
   - Calculates total score
   - Shows a live summary

6. TA saves and moves to the next student

## A concrete example (end-to-end)

**Assignment:** Programming Lab
**Student:** Alice

| Criterion     | Max | Awarded | Feedback                                       |
| ------------- | --- | ------- | ---------------------------------------------- |
| Compiles      | 5   | 5       | Compiles successfully.                         |
| Correct logic | 10  | 7       | Logic is mostly correct, but fails edge cases. |
| Style         | 5   | 3       | Inconsistent naming and formatting.            |

**Total:** 15 / 20

## Project structure

This project will be made up of a monorepo with the following structure

```text
./
    frontend    # where the web application lives
    backend     # where the server lives
```

## Technology

- Frontend: Vue.js (Vue 3 + TypeScript)
- Backend: ASP.NET Core (.NET 8)
- Database: SQLite
- Deployment: single local instance, self-hosted

## Developer Get Started

1. Clone the repo
1. Install the requirements for the python virtual environment
   ```bash
   python -m venv .venv
   . .venv/Scripts/Activate # Windows
   source .venv/bin/activate # macOS / Linux
   pip install -r requirements.txt
   ```
1. Activate pre-commit hooks
   ```bash
   python -m pre_commit install
   ```
