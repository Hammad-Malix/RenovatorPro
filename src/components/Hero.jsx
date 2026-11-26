import builderConfig from '../config/builderConfig.js'

function Hero({ onEstimateClick }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="hero__content">
        <p className="hero__tagline">{builderConfig.tagline}</p>
        <h1 id="hero-heading" className="hero__title">
          Custom Kitchens, Bathrooms &amp; Home Additions Built on Schedule
        </h1>
        <p className="hero__subheadline">
          Thoughtfully designed renovations across{' '}
          {builderConfig.serviceAreas.join(', ')},
          with careful craftsmanship and timelines you can trust.
        </p>
        <a
          className="hero__cta"
          href="#estimator"
          onClick={onEstimateClick}
        >
          Get a Free Estimate
        </a>
        <ul className="hero__trust-badges" aria-label="Credentials and guarantees">
          <li className="hero__trust-badge">
            <strong className="hero__trust-value">
              {builderConfig.trustBadges.licensedInsured.label}
            </strong>
            <span className="hero__trust-label">
              {builderConfig.trustBadges.licensedInsured.licenseLabel}{' '}
              {builderConfig.licenseNumber}
            </span>
          </li>
          <li className="hero__trust-badge">
            <strong className="hero__trust-value">
              {builderConfig.trustBadges.googleRating.rating.toFixed(1)}
              <span aria-hidden="true">★</span>
            </strong>
            <span className="hero__trust-label">
              {builderConfig.trustBadges.googleRating.source}{' '}
              {builderConfig.trustBadges.googleRating.label}
            </span>
          </li>
          <li className="hero__trust-badge">
            <strong className="hero__trust-value">
              {builderConfig.trustBadges.structuralWarranty.years}-
              {builderConfig.trustBadges.structuralWarranty.unit}
            </strong>
            <span className="hero__trust-label">
              {builderConfig.trustBadges.structuralWarranty.coverage}
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Hero
