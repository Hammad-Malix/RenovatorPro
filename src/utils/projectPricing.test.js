import assert from 'node:assert/strict'
import test from 'node:test'
import pricingConfig from '../config/pricingConfig.js'
import {
  calculateProjectEstimate,
  formatEstimatePrice,
} from './projectPricing.js'

test('calculates sensible price and timeline ranges for every configured combination', () => {
  for (const [projectType, project] of Object.entries(pricingConfig.projects)) {
    for (const [finishTier, costPerSqFt] of Object.entries(
      project.baseCostPerSqFt,
    )) {
      const estimate = calculateProjectEstimate({
        projectType,
        finishTier,
        squareFeet: project.defaultSqFt,
      })
      const baseCost = project.defaultSqFt * costPerSqFt
      const expectedWeeks =
        (project.timeline.baseWeeks +
          (project.defaultSqFt / 100) * project.timeline.weeksPer100SqFt) *
        pricingConfig.timeline.finishTierMultipliers[finishTier]

      assert.ok(estimate.priceRange.min > 0)
      assert.ok(estimate.priceRange.max > estimate.priceRange.min)
      assert.equal(
        estimate.priceRange.min,
        Math.round(
          (baseCost * (1 - pricingConfig.rangeSpread)) / 100,
        ) * 100,
      )
      assert.equal(
        estimate.priceRange.max,
        Math.round(
          (baseCost * (1 + pricingConfig.rangeSpread)) / 100,
        ) * 100,
      )
      assert.ok(estimate.timelineRange.minWeeks >= 1)
      assert.ok(
        estimate.timelineRange.maxWeeks > estimate.timelineRange.minWeeks,
      )
      assert.equal(
        estimate.timelineRange.minWeeks,
        Math.max(
          1,
          Math.floor(expectedWeeks * (1 - pricingConfig.timeline.rangeSpread)),
        ),
      )
      assert.equal(
        estimate.timelineRange.maxWeeks,
        Math.ceil(expectedWeeks * (1 + pricingConfig.timeline.rangeSpread)),
      )
    }
  }
})

test('uses the configured finish multiplier and formats the price range currency', () => {
  const estimate = calculateProjectEstimate({
    projectType: 'kitchen',
    finishTier: 'midRange',
    squareFeet: 180,
  })

  assert.deepEqual(estimate, {
    priceRange: {
      min: 43600,
      max: 55400,
    },
    timelineRange: {
      minWeeks: 4,
      maxWeeks: 6,
    },
  })
  assert.equal(formatEstimatePrice(43600), '£43,600')
})

test('rejects unknown project types, finish tiers, and out-of-bounds areas', () => {
  assert.throws(
    () =>
      calculateProjectEstimate({
        projectType: 'unknown',
        finishTier: 'standard',
        squareFeet: 100,
      }),
    RangeError,
  )
  assert.throws(
    () =>
      calculateProjectEstimate({
        projectType: 'kitchen',
        finishTier: 'unknown',
        squareFeet: 100,
      }),
    RangeError,
  )
  assert.throws(
    () =>
      calculateProjectEstimate({
        projectType: 'kitchen',
        finishTier: 'standard',
        squareFeet: 49,
      }),
    RangeError,
  )
})
