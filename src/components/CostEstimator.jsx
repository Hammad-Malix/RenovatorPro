import { useState } from 'react'
import builderConfig from '../config/builderConfig.js'
import LeadCaptureForm from './LeadCaptureForm.jsx'
import {
  calculateProjectEstimate,
  formatEstimatePrice,
} from '../utils/projectPricing.js'

const projectTypeLabels = {
  kitchen: 'Kitchen Remodel',
  bathroom: 'Bathroom Remodel',
  addition: 'Full Home Addition',
  customHome: 'Custom Home',
}

const projectTypeIcons = {
  kitchen: (
    <>
      <path d="M4 10h16v10H4zM7 13h4v4H7zM14 13h3M14 16h3" />
      <path d="M6 7h1M10 7h1M14 7h1M18 7h1M3 10h18" />
    </>
  ),
  bathroom: (
    <>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" />
      <path d="M7 12V6a3 3 0 0 1 6 0v1M13 7h3v2M6 19l-1 2M18 19l1 2" />
    </>
  ),
  addition: (
    <>
      <path d="m3 12 7-6 7 6v8H3zM17 14h4v6h-4" />
      <path d="M8 20v-4h4v4M19 3v6M16 6h6" />
    </>
  ),
  customHome: (
    <>
      <path d="m3 11 9-8 9 8v10H3z" />
      <path d="M9 21v-7h6v7M7 11h2M15 11h2M12 9v1" />
    </>
  ),
}

function ProjectTypeIcon({ type }) {
  return (
    <svg
      className="estimator__project-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {projectTypeIcons[type]}
    </svg>
  )
}

const estimatorSteps = [
  'Project type',
  'Finish level',
  'Project size',
]

function clampProjectArea(value, pricing) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return pricing.defaultSqFt
  }
  return Math.min(
    pricing.maxSqFt,
    Math.max(pricing.minSqFt, Math.round(numericValue)),
  )
}

function CostEstimator({
  activeStep,
  estimatorRef,
  onProjectTypeChange,
  onStepChange,
  projectType,
}) {
  const projectTypes = Object.keys(builderConfig.pricing.projects)
  const projectPricing = projectType
    ? builderConfig.pricing.projects[projectType]
    : null
  const [projectAreaSelection, setProjectAreaSelection] = useState(null)
  const [projectAreaDraftSelection, setProjectAreaDraftSelection] = useState(null)
  const [finishTier, setFinishTier] = useState('')
  const projectArea =
    projectAreaSelection?.projectType === projectType
      ? projectAreaSelection.value
      : projectPricing?.defaultSqFt ?? null
  const projectAreaDraft =
    projectAreaDraftSelection?.projectType === projectType
      ? projectAreaDraftSelection.value
      : null
  const estimate =
    projectPricing && finishTier && projectArea !== null
      ? calculateProjectEstimate({
          projectType,
          finishTier,
          squareFeet: projectArea,
        })
      : null
  const leadEstimate = estimate
    ? {
        projectType,
        projectTypeLabel: projectTypeLabels[projectType],
        finishTier,
        finishTierLabel: builderConfig.pricing.finishTiers[finishTier].label,
        squareFeet: projectArea,
        currency: builderConfig.pricing.currency,
        priceRange: estimate.priceRange,
        timelineRange: estimate.timelineRange,
      }
    : null

  const canContinue =
    activeStep === 1
      ? Boolean(projectType)
      : activeStep === 2
        ? Boolean(finishTier)
        : false

  function updateProjectArea(value) {
    const nextArea = clampProjectArea(value, projectPricing)
    setProjectAreaSelection({ projectType, value: nextArea })
    setProjectAreaDraftSelection({ projectType, value: null })
  }

  function handleProjectAreaInput(event) {
    const value = event.target.value
    setProjectAreaDraftSelection({ projectType, value })

    if (value !== '') {
      const numericValue = Number(value)
      if (
        Number.isFinite(numericValue) &&
        numericValue >= projectPricing.minSqFt &&
        numericValue <= projectPricing.maxSqFt
      ) {
        setProjectAreaSelection({ projectType, value: numericValue })
      }
    }
  }

  function commitProjectAreaInput() {
    if (projectAreaDraft !== null) {
      updateProjectArea(projectAreaDraft)
    }
  }

  function handleProjectTypeChange(type) {
    onProjectTypeChange(type)
    setProjectAreaSelection({
      projectType: type,
      value: builderConfig.pricing.projects[type].defaultSqFt,
    })
    setProjectAreaDraftSelection(null)
  }

  function goBack() {
    onStepChange(Math.max(1, activeStep - 1))
  }

  function goNext() {
    if (canContinue) {
      onStepChange(Math.min(estimatorSteps.length, activeStep + 1))
    }
  }

  return (
    <section
      className="page-section estimator"
      id="estimator"
      ref={estimatorRef}
      tabIndex={-1}
      aria-labelledby="estimator-heading"
    >
      <div className="estimator__content">
        <p className="estimator__step-label">Cost &amp; Timeline Estimator</p>
        <h2 id="estimator-heading">Plan Your Project</h2>

        <ol className="estimator__progress" aria-label="Estimator progress">
          {estimatorSteps.map((label, index) => {
            const step = index + 1
            return (
              <li
                className={step === activeStep ? 'is-active' : ''}
                aria-current={step === activeStep ? 'step' : undefined}
                key={label}
              >
                <span className="estimator__progress-number">{step}</span>
                <span>{label}</span>
              </li>
            )
          })}
        </ol>

        <div className="estimator__step-content">
          {activeStep === 1 && (
            <fieldset className="estimator__field-group">
              <legend>Step 1: Choose your project type</legend>
              <div className="estimator__options">
                {projectTypes.map((type) => (
                  <label
                    className={`estimator__option estimator__project-card${projectType === type ? ' is-selected' : ''}`}
                    key={type}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type}
                      checked={projectType === type}
                      onChange={() => handleProjectTypeChange(type)}
                    />
                    <span className="estimator__project-card-content">
                      <ProjectTypeIcon type={type} />
                      <span>{projectTypeLabels[type]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {activeStep === 2 && projectPricing && (
            <div className="estimator__details">
              <h3>Step 2: Choose your finish level</h3>
              <fieldset className="estimator__field-group">
                <legend>Select one finish tier</legend>
                <div className="estimator__options">
                  {Object.keys(projectPricing.baseCostPerSqFt).map((tier) => (
                    <label
                      className={`estimator__option estimator__finish-card${finishTier === tier ? ' is-selected' : ''}`}
                      key={tier}
                    >
                      <input
                        type="radio"
                        name="finishTier"
                        value={tier}
                        checked={finishTier === tier}
                        onChange={() => setFinishTier(tier)}
                      />
                      <span className="estimator__finish-card-content">
                        <span className="estimator__finish-card-title">
                          {builderConfig.pricing.finishTiers[tier].label}
                        </span>
                        <span className="estimator__finish-card-description">
                          {builderConfig.pricing.finishTiers[tier].description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {activeStep === 3 && projectPricing && (
            <div className="estimator__area-step">
              <h3>Step 3: Set your project size</h3>
              <label className="estimator__area-field" htmlFor="project-area">
                Approximate square footage
                <input
                  id="project-area"
                  type="number"
                  min={projectPricing.minSqFt}
                  max={projectPricing.maxSqFt}
                  step="1"
                  value={projectAreaDraft ?? projectArea ?? ''}
                  onChange={handleProjectAreaInput}
                  onBlur={commitProjectAreaInput}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitProjectAreaInput()
                    }
                  }}
                  aria-describedby="project-area-hint"
                />
              </label>
              <input
                className="estimator__area-slider"
                type="range"
                min={projectPricing.minSqFt}
                max={projectPricing.maxSqFt}
                step="1"
                value={projectArea ?? projectPricing.defaultSqFt}
                onChange={(event) => updateProjectArea(event.target.value)}
                aria-label="Project size slider"
                aria-valuetext={`${projectArea} square feet`}
              />
              <div className="estimator__area-bounds" aria-hidden="true">
                <span>{projectPricing.minSqFt.toLocaleString()} sq. ft.</span>
                <span>{projectPricing.maxSqFt.toLocaleString()} sq. ft.</span>
              </div>
              <p className="estimator__hint" id="project-area-hint">
                Enter a value between {projectPricing.minSqFt.toLocaleString()}
                {' and '}
                {projectPricing.maxSqFt.toLocaleString()} sq. ft.
              </p>
              {estimate && (
                <div className="estimator__result-layout">
                  <section
                    className="estimator__estimate-output"
                    aria-label="Estimated project cost and timeline"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <p className="estimator__estimate-eyebrow">
                      Your ballpark estimate
                    </p>
                    <div className="estimator__estimate-results">
                      <div>
                        <span className="estimator__estimate-label">
                          Estimated project cost
                        </span>
                        <strong className="estimator__estimate-value">
                          {formatEstimatePrice(estimate.priceRange.min)}
                          {' – '}
                          {formatEstimatePrice(estimate.priceRange.max)}
                        </strong>
                      </div>
                      <div>
                        <span className="estimator__estimate-label">
                          Estimated build timeline
                        </span>
                        <strong className="estimator__estimate-value">
                          {estimate.timelineRange.minWeeks}
                          {' – '}
                          {estimate.timelineRange.maxWeeks} weeks
                        </strong>
                      </div>
                    </div>
                    <p className="estimator__estimate-disclaimer">
                      Planning estimate only. Final cost and schedule depend on
                      project scope and site conditions.
                    </p>
                  </section>
                  <LeadCaptureForm estimate={leadEstimate} />
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="estimator__navigation" aria-label="Estimator steps">
          <button
            type="button"
            className="estimator__back"
            onClick={goBack}
            disabled={activeStep === 1}
          >
            Back
          </button>
          {activeStep < estimatorSteps.length && (
            <button
              type="button"
              className="estimator__next"
              onClick={goNext}
              disabled={!canContinue}
            >
              Next
            </button>
          )}
        </nav>
      </div>
    </section>
  )
}

export default CostEstimator
