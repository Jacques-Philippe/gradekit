# GradeKit — Design Reference

Derived from a reference screenshot of a TA assignment detail view.

Must work on mobile and desktop.
---

## Layout

### Shell
- **Left sidebar** (fixed width, ~220px) + **main content area** (flex fill)
- **Top bar** across full width: product name left, global nav tabs center, utility icons right (notifications, help, avatar)
- Sidebar and top bar are persistent across views

### Sidebar
- Product name + workspace label at the top (e.g. "GradeKit / TA Workspace")
- Nav items with icon + label: Dashboard, My Courses, Gradebook, Settings
- Active item has a filled background highlight
- **Primary CTA button** pinned to the bottom of the sidebar (e.g. "New Assessment") — dark navy, full width
- Help Center link below the CTA

### Main content
- Breadcrumb at the top (e.g. Courses › CS501 › Assignments)
- Page header: large bold title, muted description text, action buttons top-right (secondary + primary)
- Content below header is divided into sections with a section label and icon

---

## Components

### Stats bar
A row of 4 stat cards below the page header.
- Each card: label in small muted text, value in large bold text
- Last card (Status) uses a light blue tinted background to draw attention
- Status value has a colored dot prefix

### Question card
Each question in the list is a card with:
- **Header row:** question number badge (gray pill), type badge (colored pill), points badge (icon + number)
- **Body:** question text in bold
- **Optional blocks below the question text:**
  - Grading rubric context — indented block with a left border accent, label in colored bold text, body in muted text
  - Multiple choice answers — 2×2 grid of answer tiles; selected answer has a filled dark circle indicator
  - Code challenge metadata — inline tags (e.g. "Autograder Enabled", "4 Test Cases")

### Type badges
Colored pills indicating question type. Each type has its own color:
- Open Response — orange
- Multiple Choice — blue
- Code Challenge — green/teal

### Action buttons
- **Primary:** dark navy background, white text, rounded
- **Secondary:** light gray background, dark text, rounded, with an icon prefix

---

## Color

| Role | Value |
|---|---|
| Primary (nav, CTA, header buttons) | Dark navy `~#1a2844` |
| Page background | Off-white / light gray `~#f5f6f8` |
| Card background | White `#ffffff` |
| Status card background | Light blue `~#e8f0fb` |
| Muted text | Medium gray `~#6b7280` |
| Border / divider | Light gray `~#e5e7eb` |
| Badge — Open Response | Orange |
| Badge — Multiple Choice | Blue |
| Badge — Code Challenge | Green / teal |
| Rubric context border accent | Blue |

---

## Typography

| Element | Style |
|---|---|
| Page title | ~28px, bold |
| Page description | ~14px, muted gray |
| Section heading | ~14px, semi-bold, with leading icon |
| Question text | ~16px, bold |
| Stat value | ~22px, bold |
| Stat label | ~12px, muted |
| Badge text | ~12px, semi-bold |
| Body / metadata | ~13–14px, regular |

---

## Spacing & Shape

- Cards use a subtle border (`1px solid`) and light box shadow, no heavy elevation
- Border radius: ~8px on cards and buttons, ~12px on pill badges
- Consistent padding inside cards: ~16–20px
- Gap between question cards: ~12–16px
- Section heading has a small icon to its left (inline, same color as text)

---

## Design Principles (inferred)

- **Information density without clutter** — stats, type, and points are visible at a glance without opening anything
- **Hierarchy through typography** — bold question text, muted metadata, large stat values
- **Color for categorization only** — type badges use color functionally, not decoratively
- **Primary action always visible** — CTA in sidebar and top-right of each page header are never hidden

---

## AI Interactions

### Feedback autocomplete

Inline ghost text in the feedback field on `GradeSubmissionView`, following the Copilot-style pattern:

1. TA begins typing in a feedback field (criterion note or general comment)
2. After a **500ms debounce** and a **minimum of 3 characters**, the frontend requests a suggestion from the backend
3. The top suggestion appears as **greyed-out ghost text** inline, completing the current sentence
4. **Tab** accepts the suggestion; any other key dismisses it and continues normal input
5. If multiple suggestions are available, repeated **Tab** presses cycle through them before wrapping back to the TA's original text

**Scope:** suggestions are drawn from comments the TA has previously written for the **same criterion** across all assignments. Per-criterion scope keeps suggestions relevant; cross-criterion suggestions would be too noisy.

**Graceful degradation:** if the TA has no prior history for a criterion (e.g. first time grading), no ghost text is shown. The feature becomes more useful over time as history accumulates.

**Visual style:** ghost text uses muted gray (`~#9ca3af`), same font and size as the input. No tooltip, no dropdown — the suggestion is entirely inline to avoid breaking reading flow.
