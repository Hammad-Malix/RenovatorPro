import { useState } from 'react'
import builderConfig from '../config/builderConfig.js'

function Header({ onEstimateClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navClassName = isMenuOpen
    ? 'site-header__nav site-header__nav--open'
    : 'site-header__nav'
  const actionsClassName = isMenuOpen
    ? 'site-header__actions site-header__actions--open'
    : 'site-header__actions'
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <a className="site-header__brand" href="#home">
        {builderConfig.companyName}
      </a>
      <button
        className="site-header__menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="site-header__menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav
        className={navClassName}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>
        <a href="#estimator" onClick={closeMenu}>
          Cost Estimator
        </a>
        <a href="#process" onClick={closeMenu}>
          Our Process
        </a>
      </nav>
      <div className={actionsClassName}>
        <a
          className="site-header__cta"
          href="#estimator"
          onClick={(event) => {
            closeMenu()
            onEstimateClick(event)
          }}
        >
          Get a Free Estimate
        </a>
      </div>
    </header>
  )
}

export default Header
