# vector-hub-144

AI Engineering documentation platform with lesson corrections from upstream issue #585.

> Work in progress. This checkpoint may be incomplete or fail tests. See PLAN.md and STATUS.md before use.

Maintainer: Ryan Vo <ryandtvo@gmail.com>

## Quick Start

### Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
venv/bin/pip install -r requirements.txt
venv/bin/python main.py
# Serves at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
# Serves at http://localhost:5173
```

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/phases` — List all 20 phases with lesson counts
- `GET /api/phases/{num}` — Get phase with lessons
- `GET /api/lessons/{id}` — Get lesson with corrections

## Features Implemented

- **Phase 12 (Multimodal AI)** lessons with corrections applied from upstream factual errors
- Inline correction display: toggle between original (strikethrough) + corrected, or clean corrected version
- Corrections panel showing field-level diffs with explanatory notes
- Phase sidebar navigation with lesson lists

## Data Source

Lesson corrections based on [rohitg00/ai-engineering-from-scratch#585](https://github.com/rohitg00/ai-engineering-from-scratch/issues/585) — factual/self-contradiction errors in English docs across phases 00–19.

