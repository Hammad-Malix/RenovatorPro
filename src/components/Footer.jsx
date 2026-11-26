import builderConfig from '../config/builderConfig.js'

function Footer({ onEstimateClick }) {
  const footerConfig = builderConfig.footer

  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__brand">
          <a className="site-footer__wordmark" href="#home">
            {builderConfig.companyName}
          </a>
          <p>{builderConfig.tagline}</p>
        </div>

        <section
          className="site-footer__group"
          aria-labelledby="footer-credentials-heading"
        >
          <h2 id="footer-credentials-heading">
            {footerConfig.credentialsHeading}
          </h2>
          <p>{builderConfig.trustBadges.licensedInsured.label}</p>
          <p>
            {builderConfig.trustBadges.licensedInsured.licenseLabel}{' '}
            {builderConfig.licenseNumber}
          </p>
        </section>

        <section
          className="site-footer__group"
          aria-labelledby="footer-service-areas-heading"
        >
          <h2 id="footer-service-areas-heading">
            {footerConfig.serviceAreasHeading}
          </h2>
          <ul>
            {builderConfig.serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>

        <nav
          className="site-footer__group"
          aria-label={footerConfig.quickLinksHeading}
        >
          <h2>{footerConfig.quickLinksHeading}</h2>
          <ul>
            {footerConfig.quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section
          className="site-footer__group site-footer__contact"
          aria-labelledby="footer-contact-heading"
        >
          <h2 id="footer-contact-heading">{footerConfig.contactHeading}</h2>
          <a href={`tel:${builderConfig.phone}`}>{builderConfig.phone}</a>
          <a href={`mailto:${builderConfig.email}`}>{builderConfig.email}</a>
          <a
            className="site-footer__estimate"
            href="#estimator"
            onClick={onEstimateClick}
          >
            {footerConfig.estimateCtaLabel}
          </a>
        </section>
      </div>
    </footer>
  )
}

export default Footer
