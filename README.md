## GradeKit Concept Summary

**Purpose**
A local-first, web-based grading application designed to help university Teaching Assistants grade assignments faster, more consistently, and with less mental overhead.

**Target User**
A single TA grading one course during one semester.

**Core Problem It Solves**

- Rubric-based grading is slow and inconsistent in existing tools
- Repetitive feedback wastes time
- Grading decisions are hard to defend during disputes
- LMS tools are heavy, inflexible, or require institutional access

**Key Principles**

- Local-first: runs on the TA’s own machine
- Simple setup: no accounts, no SSO, no university IT involvement
- Focused scope: grading only, not a full LMS
- Opinionated UX: optimized for the grading workflow

**Core Features (v1)**

- Create assignments
- Define rubrics with criteria and point values
- Grade submissions using the rubric
- Apply reusable feedback snippets
- Automatically calculate scores
- Maintain a clear audit trail of grading decisions
- Export grades and feedback in common formats (e.g. CSV)

**Technology**

- Frontend: Vue.js (Vue 3 + TypeScript)
- Backend: ASP.NET Core (.NET 8)
- Database: SQLite
- Deployment: single local instance, self-hosted

**End Goal**
A small, trustworthy tool that a TA can adopt immediately to make grading suck less—without bureaucracy, lock-in, or unnecessary complexity.
