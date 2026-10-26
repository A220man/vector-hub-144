from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
from pathlib import Path

app = FastAPI(title="vector-hub-144", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Correction(BaseModel):
    field: str
    original: str
    corrected: str
    note: Optional[str] = None

class Lesson(BaseModel):
    id: str
    phase: int
    title: str
    hook: Optional[str] = None
    body: Optional[str] = None
    corrections: list[Correction] = []

class Phase(BaseModel):
    number: int
    name: str
    lessons: list[Lesson] = []

# Load lesson data
DATA_DIR = Path(__file__).parent / "data"

def load_phases() -> list[Phase]:
    phases = []
    for phase_num in range(20):
        phase_file = DATA_DIR / f"phase_{phase_num:02d}.json"
        if phase_file.exists():
            with open(phase_file) as f:
                data = json.load(f)
                phases.append(Phase(**data))
        else:
            # Create placeholder phase
            phases.append(Phase(number=phase_num, name=f"Phase {phase_num}", lessons=[]))
    return phases

PHASES = load_phases()

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "vector-hub-144"}

@app.get("/api/phases")
def get_phases():
    return [{"number": p.number, "name": p.name, "lesson_count": len(p.lessons)} for p in PHASES]

@app.get("/api/phases/{phase_num}")
def get_phase(phase_num: int):
    if 0 <= phase_num < len(PHASES):
        phase = PHASES[phase_num]
        return {
            "number": phase.number,
            "name": phase.name,
            "lessons": [
                {"id": l.id, "title": l.title, "hook": l.hook}
                for l in phase.lessons
            ]
        }
    return {"error": "Phase not found"}, 404

@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: str):
    for phase in PHASES:
        for lesson in phase.lessons:
            if lesson.id == lesson_id:
                # Apply corrections to body
                corrected_body = lesson.body or ""
                for correction in lesson.corrections:
                    if correction.field == "body":
                        corrected_body = corrected_body.replace(correction.original, correction.corrected)
                    elif correction.field == "hook":
                        # Hook corrections handled separately
                        pass
                return {
                    "id": lesson.id,
                    "phase": lesson.phase,
                    "title": lesson.title,
                    "hook": lesson.hook,
                    "body": corrected_body,
                    "corrections": [c.model_dump() for c in lesson.corrections]
                }
    return {"error": "Lesson not found"}, 404

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
