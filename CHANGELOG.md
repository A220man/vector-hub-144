# Changelog

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

### Added

- FastAPI backend with lesson data API (`/api/phases`, `/api/phases/{num}`, `/api/lessons/{id}`)
- React frontend with phase sidebar, lesson list, and lesson view
- Phase 12 (Multimodal AI) lesson data with corrections from upstream issue #585
- Inline correction display toggle: shows original (strikethrough) + corrected text, or clean corrected version
- Corrections panel showing detailed field-level corrections with notes

### Infrastructure

- Python virtual environment for backend dependencies
- Vite + React 19 frontend with oxlint

