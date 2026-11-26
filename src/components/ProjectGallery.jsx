import { useState } from 'react'
import builderConfig from '../config/builderConfig.js'
import {
  formatBudgetTier,
  getProjectBudgetRange,
} from '../utils/projectPricing.js'

const filters = [
  { id: 'all', label: 'All Projects' },
  ...Array.from(
    new Set(builderConfig.portfolioProjects.map((project) => project.category)),
  ).map((category) => ({ id: category, label: category })),
]

function ProjectGallery({ onOpenProject }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const projects =
    activeFilter === 'all'
      ? builderConfig.portfolioProjects
      : builderConfig.portfolioProjects.filter(
          (project) => project.category === activeFilter,
        )

  return (
    <section
      className="project-gallery"
      id="projects"
      aria-labelledby="project-gallery-heading"
    >
      <div className="project-gallery__inner">
        <header className="project-gallery__header">
          <p className="project-gallery__eyebrow">Our portfolio</p>
          <h2 id="project-gallery-heading">Featured Projects</h2>
          <p>Browse renovation highlights by project category.</p>
        </header>

        <div className="project-gallery__filters" role="group" aria-label="Filter projects">
          {filters.map((filter) => (
            <button
              className={`project-gallery__filter${activeFilter === filter.id ? ' is-active' : ''}`}
              type="button"
              key={filter.id}
              aria-pressed={activeFilter === filter.id}
              aria-controls="project-grid"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <p className="project-gallery__result-count" aria-live="polite">
          Showing {projects.length}{' '}
          {projects.length === 1 ? 'project' : 'projects'}
        </p>

        <div className="project-gallery__grid" id="project-grid">
          {projects.map((project) => {
            const budgetRange = getProjectBudgetRange(project)

            return (
              <article
                className="project-card"
                key={project.title}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Open ${project.title} project details`}
                onClick={(event) => onOpenProject(project, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpenProject(project, event.currentTarget)
                  }
                }}
              >
                <div className="project-card__media">
                  <img
                    src={project.afterImg}
                    alt={`${project.title} after renovation`}
                    loading="lazy"
                  />
                  <div className="project-card__badges">
                    {project.isSample && (
                      <span className="project-card__sample">Illustrative sample</span>
                    )}
                    <span className="project-card__budget-pill">
                      {budgetRange.min}–{budgetRange.max}
                    </span>
                  </div>
                </div>
                <div className="project-card__body">
                  <p className="project-card__category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-card__location">
                    {project.location} · {project.squareFeet.toLocaleString()} sq. ft.
                  </p>
                  <dl className="project-card__details">
                    <div>
                      <dt>Finish tier</dt>
                      <dd>{formatBudgetTier(project.budgetTier)}</dd>
                    </div>
                    <div>
                      <dt>Timeline</dt>
                      <dd>{project.timeline}</dd>
                    </div>
                  </dl>
                  <ul className="project-card__highlights">
                    {project.scopeHighlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProjectGallery
