# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

docs-platform-skeleton

## Roadmap

### docs-platform-skeleton — Documentation Platform Skeleton

Status: done

Acceptance:
- FastAPI server runs and serves lesson content
- React frontend loads and displays lesson list
- Lesson content rendered with corrections applied

Implementation: `backend/main.py`, `frontend/src/App.jsx`, `frontend/src/App.css`

### lesson-corrections-engine — Lesson Corrections Engine

Status: in_progress

Acceptance:
- Corrections loaded from structured data
- Applied to lesson content at render time
- Original and corrected versions traceable

Implementation: `backend/main.py`, `frontend/src/App.jsx`

### phase-navigation — Phase Navigation UI

Status: planned

Acceptance:
- Sidebar shows all 20 phases (00-19)
- Clicking phase shows lessons
- URL routing works for deep links

Implementation: `frontend/src/App.jsx`

