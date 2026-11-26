import bathroomAfter from '../assets/bathroom-after.svg'
import bathroomBefore from '../assets/bathroom-before.svg'
import additionAfter from '../assets/addition-after.svg'
import additionBefore from '../assets/addition-before.svg'
import kitchenAfter from '../assets/kitchen-after.svg'
import kitchenBefore from '../assets/kitchen-before.svg'
import pricingConfig from './pricingConfig.js'

const builderConfig = Object.freeze({
  companyName: 'Renovators',
  tagline: 'Easy to Connect',
  licenseNumber: '123456778901234',
  phone: '0123456789',
  email: 'abc@gmail.com',
  serviceAreas: ['London'],
  footer: {
    credentialsHeading: 'Licensing & credentials',
    serviceAreasHeading: 'Service areas',
    quickLinksHeading: 'Quick links',
    contactHeading: 'Get in touch',
    quickLinks: [
      { label: 'Home', href: '#home' },
      { label: 'Projects', href: '#projects' },
      { label: 'Cost Estimator', href: '#estimator' },
      { label: 'Our Process', href: '#process' },
    ],
    estimateCtaLabel: 'Start Your Project Estimate',
  },
  leadSubmission: {
    endpoint: '',
    accessKey: '',
  },
  trustBadges: {
    licensedInsured: {
      label: 'Licensed & Insured',
      licenseLabel: 'License',
    },
    googleRating: {
      rating: 4.9,
      source: 'Google',
      label: 'Rating',
    },
    structuralWarranty: {
      years: 15,
      unit: 'Year',
      coverage: 'Structural Warranty',
    },
  },
  pricing: pricingConfig,
  portfolioProjects: [
    {
      category: 'Kitchen Remodels',
      title: 'Demo: Hackney Kitchen Refresh',
      location: 'Hackney, London',
      squareFeet: 180,
      budgetTier: 'midRange',
      timeline: '5 weeks',
      beforeImg: kitchenBefore,
      afterImg: kitchenAfter,
      scopeHighlights: [
        'Updated cabinetry and worktops',
        'Improved task lighting',
        'New flooring and finishes',
      ],
      isSample: true,
    },
    {
      category: 'Kitchen Remodels',
      title: 'Demo: Greenwich Family Kitchen',
      location: 'Greenwich, London',
      squareFeet: 140,
      budgetTier: 'standard',
      timeline: '4 weeks',
      beforeImg: kitchenBefore,
      afterImg: kitchenAfter,
      scopeHighlights: [
        'Refreshed cabinet fronts',
        'Replaced sink and tap',
        'Added durable wall finishes',
      ],
      isSample: true,
    },
    {
      category: 'Luxury Bathrooms',
      title: 'Demo: Islington Ensuite',
      location: 'Islington, London',
      squareFeet: 70,
      budgetTier: 'luxury',
      timeline: '4 weeks',
      beforeImg: bathroomBefore,
      afterImg: bathroomAfter,
      scopeHighlights: [
        'Walk-in shower installation',
        'Stone-effect tile and vanity',
        'Heated floor and ambient lighting',
      ],
      isSample: true,
    },
    {
      category: 'Luxury Bathrooms',
      title: 'Demo: Battersea Guest Bathroom',
      location: 'Battersea, London',
      squareFeet: 55,
      budgetTier: 'midRange',
      timeline: '3 weeks',
      beforeImg: bathroomBefore,
      afterImg: bathroomAfter,
      scopeHighlights: [
        'New bath and shower screen',
        'Updated storage and fittings',
        'Fresh tile and paint finishes',
      ],
      isSample: true,
    },
    {
      category: 'Custom Additions',
      title: 'Demo: Richmond Rear Addition',
      location: 'Richmond, London',
      squareFeet: 420,
      budgetTier: 'midRange',
      timeline: '14 weeks',
      beforeImg: additionBefore,
      afterImg: additionAfter,
      scopeHighlights: [
        'Rear living-space extension',
        'Large glazed garden doors',
        'Open-plan interior finishes',
      ],
      isSample: true,
    },
    {
      category: 'Custom Additions',
      title: 'Demo: Hampstead Side Addition',
      location: 'Hampstead, London',
      squareFeet: 650,
      budgetTier: 'luxury',
      timeline: '20 weeks',
      beforeImg: additionBefore,
      afterImg: additionAfter,
      scopeHighlights: [
        'Two-level side addition',
        'Expanded kitchen and living areas',
        'Matched exterior and interior finishes',
      ],
      isSample: true,
    },
  ],
})

export default builderConfig
