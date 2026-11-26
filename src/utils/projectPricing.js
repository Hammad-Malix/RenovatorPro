import pricingConfig from '../config/pricingConfig.js'

const pricingTypeByCategory = {
  'Kitchen Remodels': 'kitchen',
  'Luxury Bathrooms': 'bathroom',
  'Custom Additions': 'addition',
}

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: pricingConfig.currency,
  notation: 'compact',
  maximumFractionDigits: 1,
})

const estimateCurrencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: pricingConfig.currency,
  maximumFractionDigits: 0,
})

export function calculateProjectEstimate({
  projectType,
  finishTier,
  squareFeet,
}) {
  const projectPricing = pricingConfig.projects[projectType]
  if (!projectPricing) {
    throw new RangeError(`No pricing matrix configured for ${projectType}`)
  }

  const costPerSqFt = projectPricing.baseCostPerSqFt[finishTier]
  if (!Number.isFinite(costPerSqFt) || costPerSqFt <= 0) {
    throw new RangeError(`No ${finishTier} rate configured for ${projectType}`)
  }

  if (
    !Number.isFinite(squareFeet) ||
    squareFeet < projectPricing.minSqFt ||
    squareFeet > projectPricing.maxSqFt
  ) {
    throw new RangeError(
      `${squareFeet} sq. ft. is outside the configured bounds for ${projectType}`,
    )
  }

  const finishTierMultiplier =
    pricingConfig.timeline.finishTierMultipliers[finishTier]
  if (!Number.isFinite(finishTierMultiplier) || finishTierMultiplier <= 0) {
    throw new RangeError(`No timeline multiplier configured for ${finishTier}`)
  }

  const baseCost = squareFeet * costPerSqFt
  const roundToHundred = (amount) => Math.round(amount / 100) * 100
  const costSpread = pricingConfig.rangeSpread
  const priceRange = {
    min: roundToHundred(baseCost * (1 - costSpread)),
    max: roundToHundred(baseCost * (1 + costSpread)),
  }

  const timeline = projectPricing.timeline
  const estimatedWeeks =
    (timeline.baseWeeks + (squareFeet / 100) * timeline.weeksPer100SqFt) *
    finishTierMultiplier
  const timelineSpread = pricingConfig.timeline.rangeSpread
  const minWeeks = Math.max(
    1,
    Math.floor(estimatedWeeks * (1 - timelineSpread)),
  )

  return {
    priceRange,
    timelineRange: {
      minWeeks,
      maxWeeks: Math.max(
        minWeeks,
        Math.ceil(estimatedWeeks * (1 + timelineSpread)),
      ),
    },
  }
}

export function formatEstimatePrice(amount) {
  return estimateCurrencyFormatter.format(amount)
}

export function getProjectTypeForCategory(category) {
  const projectType = pricingTypeByCategory[category]
  if (!projectType) {
    throw new RangeError(`No pricing type configured for ${category}`)
  }
  return projectType
}

export function getProjectBudgetRange(project) {
  const projectType = getProjectTypeForCategory(project.category)
  const projectPricing = pricingConfig.projects[projectType]
  if (!projectPricing) {
    throw new RangeError(`No pricing matrix configured for ${projectType}`)
  }

  const costPerSqFt = projectPricing.baseCostPerSqFt[project.budgetTier]
  if (costPerSqFt === undefined) {
    throw new RangeError(`No ${project.budgetTier} rate configured for ${projectType}`)
  }

  if (!Number.isFinite(project.squareFeet) || project.squareFeet <= 0) {
    throw new RangeError(`Invalid project area for ${project.title}`)
  }

  const baseCost = project.squareFeet * costPerSqFt
  const spread = pricingConfig.rangeSpread
  const roundToHundred = (amount) => Math.round(amount / 100) * 100

  return {
    min: currencyFormatter.format(roundToHundred(baseCost * (1 - spread))),
    max: currencyFormatter.format(roundToHundred(baseCost * (1 + spread))),
  }
}

export function formatBudgetTier(tier) {
  const configuredLabel = pricingConfig.finishTiers[tier]?.label
  if (configuredLabel) {
    return configuredLabel
  }

  return tier
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase())
}
