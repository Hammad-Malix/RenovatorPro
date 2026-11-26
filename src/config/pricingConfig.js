const pricingConfig = Object.freeze({
  currency: 'GBP',
  rateBasis: 'Editable planning estimates',
  rangeSpread: 0.12,
  finishTiers: {
    standard: {
      label: 'Standard',
      description:
        'Durable, practical materials with quality fixtures and stock cabinetry.',
    },
    midRange: {
      label: 'Mid-Range',
      description:
        'Quartz or solid-surface worktops, upgraded fixtures and semi-custom cabinetry.',
    },
    luxury: {
      label: 'Luxury Custom',
      description:
        'Custom slab stone, premium fixtures and bespoke cabinetry with tailored details.',
    },
  },
  projects: {
    kitchen: {
      baseCostPerSqFt: {
        standard: 175,
        midRange: 275,
        luxury: 425,
      },
      minSqFt: 50,
      maxSqFt: 300,
      defaultSqFt: 180,
      timeline: {
        baseWeeks: 2,
        weeksPer100SqFt: 1.5,
      },
    },
    bathroom: {
      baseCostPerSqFt: {
        standard: 200,
        midRange: 325,
        luxury: 500,
      },
      minSqFt: 25,
      maxSqFt: 150,
      defaultSqFt: 70,
      timeline: {
        baseWeeks: 2,
        weeksPer100SqFt: 2,
      },
    },
    addition: {
      baseCostPerSqFt: {
        standard: 250,
        midRange: 350,
        luxury: 500,
      },
      minSqFt: 100,
      maxSqFt: 1500,
      defaultSqFt: 420,
      timeline: {
        baseWeeks: 6,
        weeksPer100SqFt: 0.6,
      },
    },
    customHome: {
      baseCostPerSqFt: {
        standard: 300,
        midRange: 450,
        luxury: 650,
      },
      minSqFt: 800,
      maxSqFt: 5000,
      defaultSqFt: 2500,
      timeline: {
        baseWeeks: 12,
        weeksPer100SqFt: 1.2,
      },
    },
  },
  timeline: {
    formula:
      '(baseWeeks + (areaSqFt / 100) * weeksPer100SqFt) * finishTierMultiplier',
    rangeSpread: 0.15,
    finishTierMultipliers: {
      standard: 1,
      midRange: 1.1,
      luxury: 1.25,
    },
  },
})

export default pricingConfig
