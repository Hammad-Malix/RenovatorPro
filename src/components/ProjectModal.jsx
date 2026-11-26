import { useEffect, useRef, useState } from 'react'
import {
  formatBudgetTier,
  getProjectBudgetRange,
} from '../utils/projectPricing.js'

function ProjectModal({ project, onClose, onRequestSimilar }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [comparisonView, setComparisonView] = useState('after')
  const budgetRange = getProjectBudgetRange(project)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow

    function handleCancel(event) {
      event.preventDefault()
      onClose()
    }

    function handleBackdropClick(event) {
      if (event.target === dialog) {
        onClose()
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('click', handleBackdropClick)
    dialog.addEventListener('keydown', handleKeyDown)
    dialog.showModal()
    closeButtonRef.current.focus()

    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('click', handleBackdropClick)
      dialog.removeEventListener('keydown', handleKeyDown)
      if (dialog.open) {
        dialog.close()
      }
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [onClose])

  return (
    <dialog
      className="project-modal"
      ref={dialogRef}
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-location"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="project-modal__surface">
        <header className="project-modal__header">
          <div>
            <p className="project-modal__category">{project.category}</p>
            <h2 id="project-modal-title">{project.title}</h2>
            <p id="project-modal-location">{project.location}</p>
          </div>
          <button
            className="project-modal__close"
            ref={closeButtonRef}
            type="button"
            aria-label="Close project details"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>

        {project.isSample && (
          <p className="project-modal__sample">Illustrative sample project</p>
        )}

        <div className="project-modal__comparison" aria-label="Before and after project images">
          <img
            className={`project-modal__comparison-image${comparisonView === 'before' ? ' is-active' : ''}`}
            src={project.beforeImg}
            alt={`${project.title} before renovation`}
            aria-hidden={comparisonView !== 'before'}
          />
          <img
            className={`project-modal__comparison-image${comparisonView === 'after' ? ' is-active' : ''}`}
            src={project.afterImg}
            alt={`${project.title} after renovation`}
            aria-hidden={comparisonView !== 'after'}
          />
          <span className="project-modal__comparison-label" aria-live="polite">
            {comparisonView === 'before' ? 'Before' : 'After'}
          </span>
        </div>

        <div
          className="project-modal__comparison-toggle"
          role="group"
          aria-label="Select project image"
        >
          <button
            type="button"
            aria-pressed={comparisonView === 'before'}
            onClick={() => setComparisonView('before')}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={comparisonView === 'after'}
            onClick={() => setComparisonView('after')}
          >
            After
          </button>
        </div>

        <dl className="project-modal__specs">
          <div>
            <dt>Square Footage</dt>
            <dd>{project.squareFeet.toLocaleString()} sq. ft.</dd>
          </div>
          <div>
            <dt>Budget Range</dt>
            <dd>
              {budgetRange.min}–{budgetRange.max}
            </dd>
          </div>
          <div>
            <dt>Finish Tier</dt>
            <dd>{formatBudgetTier(project.budgetTier)}</dd>
          </div>
          <div>
            <dt>Build Timeline</dt>
            <dd>{project.timeline}</dd>
          </div>
        </dl>

        <h3>Scope highlights</h3>
        <ul className="project-modal__highlights">
          {project.scopeHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <button
          className="project-modal__request"
          type="button"
          onClick={() => onRequestSimilar(project)}
        >
          Request a Similar Build
        </button>
      </div>
    </dialog>
  )
}

export default ProjectModal
