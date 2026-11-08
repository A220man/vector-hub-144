import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:8000/api'

function PhaseList({ phases, selectedPhase, onSelectPhase }) {
  return (
    <aside className="sidebar">
      <h1>vector-hub-144</h1>
      <nav>
        <ul>
          {phases.map(p => (
            <li key={p.number}>
              <button
                className={selectedPhase === p.number ? 'active' : ''}
                onClick={() => onSelectPhase(p.number)}
              >
                Phase {p.number.toString().padStart(2, '0')}: {p.name} ({p.lesson_count})
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function LessonList({ phase, onSelectLesson, selectedLesson }) {
  const [filter, setFilter] = useState('')
  const filteredLessons = phase.lessons?.filter(lesson =>
    lesson.title.toLowerCase().includes(filter.toLowerCase()) ||
    lesson.id.toLowerCase().includes(filter.toLowerCase())
  ) || []

  return (
    <section className="lesson-list">
      <header>
        <h2>{phase.name}</h2>
        <input
          type="text"
          placeholder="Filter lessons..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="lesson-filter"
        />
      </header>
      <ul>
        {filteredLessons.map(lesson => (
          <li key={lesson.id}>
            <button
              onClick={() => onSelectLesson(lesson.id)}
              className={selectedLesson === lesson.id ? 'active' : ''}
            >
              <span className="lesson-id">{lesson.id}</span>
              <span className="lesson-title">{lesson.title}</span>
            </button>
          </li>
        ))}
        {filteredLessons.length === 0 && phase.lessons.length > 0 && (
          <li className="no-results">No lessons match "{filter}"</li>
        )}
      </ul>
    </section>
  )
}

function CorrectionsView({ corrections }) {
  if (!corrections || corrections.length === 0) return null
  return (
    <details className="corrections-panel">
      <summary>Corrections Applied ({corrections.length})</summary>
      <ul>
        {corrections.map((c, i) => (
          <li key={i} className="correction-item">
            <div className="correction-field">{c.field}</div>
            <div className="correction-original">Original: {c.original}</div>
            <div className="correction-corrected">Corrected: {c.corrected}</div>
            {c.note && <div className="correction-note">Note: {c.note}</div>}
          </li>
        ))}
      </ul>
    </details>
  )
}

function LessonView({ lesson }) {
  const [showCorrected, setShowCorrected] = useState(false)
  if (!lesson) return <div className="empty">Select a lesson</div>

  // Apply corrections to text
  const applyCorrections = (text, field) => {
    if (!text) return text
    const lessonCorrections = lesson.corrections?.filter(c => c.field === field) || []
    let result = text
    for (const c of lessonCorrections) {
      const escapedOriginal = c.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedOriginal, 'g')
      if (showCorrected) {
        result = result.replace(regex, `<span class="corrected-text">${c.corrected}</span>`)
      } else {
        result = result.replace(regex, `<span class="original-text"><del>${c.original}</del> <span class="corrected-inline">${c.corrected}</span></span>`)
      }
    }
    return result
  }

  const hookHtml = lesson.hook ? applyCorrections(lesson.hook, 'hook') : ''
  const bodyHtml = lesson.body
    ? applyCorrections(lesson.body, 'body').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
    : ''

  return (
    <article className="lesson-view">
      <header>
        <h2>{lesson.title}</h2>
        <span className="phase-badge">Phase {lesson.phase}</span>
      </header>
      {lesson.corrections && lesson.corrections.length > 0 && (
        <label className="correction-toggle">
          <input
            type="checkbox"
            checked={showCorrected}
            onChange={e => setShowCorrected(e.target.checked)}
          />
          {showCorrected ? 'Show Original with Corrections' : 'Show Corrected Version'}
        </label>
      )}
      {hookHtml && <div className="hook" dangerouslySetInnerHTML={{ __html: hookHtml }} />}
      {bodyHtml && <div className="body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
      <CorrectionsView corrections={lesson.corrections} />
    </article>
  )
}

function App() {
  const [phases, setPhases] = useState([])
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [phaseData, setPhaseData] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/phases`).then(r => r.json()).then(setPhases)
  }, [])

  const handleSelectPhase = async (num) => {
    setSelectedPhase(num)
    setSelectedLesson(null)
    const res = await fetch(`${API}/phases/${num}`)
    const data = await res.json()
    setPhaseData(data)
  }

  const handleSelectLesson = async (id) => {
    setLoading(true)
    const res = await fetch(`${API}/lessons/${id}`)
    const data = await res.json()
    setSelectedLesson(data)
    setLoading(false)
  }

  return (
    <div className="app">
      <PhaseList phases={phases} selectedPhase={selectedPhase} onSelectPhase={handleSelectPhase} />
      <div className="content">
        <main>
          {selectedPhase !== null && phaseData && (
            <LessonList phase={phaseData} onSelectLesson={handleSelectLesson} selectedLesson={selectedLesson} />
          )}
          {selectedPhase !== null && (
            <>
              {loading ? <div className="loading">Loading...</div> : <LessonView lesson={selectedLesson} />}
            </>
          )}
          {selectedPhase === null && (
            <div className="welcome">
              <h2>Welcome</h2>
              <p>Select a phase from the sidebar to browse lessons with factual corrections applied.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
