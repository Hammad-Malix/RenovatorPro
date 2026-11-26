import { useRef, useState } from 'react'
import {
  createLeadSubmissionPayload,
  submitLead,
  validateLeadDetails,
} from '../utils/leadCapture.js'
import { formatEstimatePrice } from '../utils/projectPricing.js'
import builderConfig from '../config/builderConfig.js'

const initialValues = {
  fullName: '',
  phoneNumber: '',
  email: '',
}

function LeadCaptureForm({ estimate }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submissionStatus, setSubmissionStatus] = useState('idle')
  const [submissionError, setSubmissionError] = useState('')
  const [submittedPayload, setSubmittedPayload] = useState(null)
  const fieldRefs = useRef({})

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: validateLeadDetails(nextValues)[name],
      }))
    }

    if (submissionStatus === 'error') {
      setSubmissionStatus('idle')
      setSubmissionError('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submissionStatus === 'loading') {
      return
    }

    const nextErrors = validateLeadDetails(values)
    setErrors(nextErrors)

    const firstInvalidField = ['fullName', 'phoneNumber', 'email'].find(
      (field) => nextErrors[field],
    )
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    const payload = createLeadSubmissionPayload(values, estimate)
    setSubmissionStatus('loading')
    setSubmissionError('')

    try {
      await submitLead(payload, builderConfig.leadSubmission)
      setSubmittedPayload(payload)
      setSubmissionStatus('success')
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'Lead submission failed. Please try again.',
      )
      setSubmissionStatus('error')
    }
  }

  if (submissionStatus === 'success' && submittedPayload) {
    return (
      <section
        className="lead-confirmation"
        aria-labelledby="lead-confirmation-heading"
        role="status"
      >
        <p className="lead-confirmation__eyebrow">Request received</p>
        <h3 id="lead-confirmation-heading">
          Thanks, {submittedPayload.fullName}
        </h3>
        <p>
          Your free on-site consultation request has been submitted. We’ll be
          in touch using the contact details below.
        </p>
        <dl className="lead-confirmation__details">
          <div>
            <dt>Project type</dt>
            <dd>{submittedPayload.estimate.projectTypeLabel}</dd>
          </div>
          <div>
            <dt>Finish</dt>
            <dd>{submittedPayload.estimate.finishTierLabel}</dd>
          </div>
          <div>
            <dt>Project size</dt>
            <dd>{submittedPayload.estimate.squareFeet.toLocaleString()} sq. ft.</dd>
          </div>
          <div>
            <dt>Estimated cost</dt>
            <dd>
              {formatEstimatePrice(
                submittedPayload.estimate.priceRange.min,
              )}
              {' – '}
              {formatEstimatePrice(
                submittedPayload.estimate.priceRange.max,
              )}
            </dd>
          </div>
          <div>
            <dt>Estimated timeline</dt>
            <dd>
              {submittedPayload.estimate.timelineRange.minWeeks}
              {' – '}
              {submittedPayload.estimate.timelineRange.maxWeeks} weeks
            </dd>
          </div>
          <div>
            <dt>Phone Number</dt>
            <dd>{submittedPayload.phoneNumber}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{submittedPayload.email}</dd>
          </div>
        </dl>
        <p className="lead-confirmation__business">
          {builderConfig.companyName} will follow up about your project.
        </p>
      </section>
    )
  }

  return (
    <form
      className="lead-form"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="lead-form-heading"
      aria-busy={submissionStatus === 'loading'}
    >
      <h3 id="lead-form-heading">Lock In Your Free On-Site Consultation</h3>
      <input
        type="hidden"
        name="estimate"
        value={JSON.stringify(estimate)}
        readOnly
      />

      <div className="lead-form__field">
        <label htmlFor="lead-full-name">Full Name</label>
        <input
          id="lead-full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={handleChange}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? 'lead-full-name-error' : undefined}
          ref={(element) => {
            fieldRefs.current.fullName = element
          }}
        />
        {errors.fullName && (
          <span className="lead-form__error" id="lead-full-name-error" role="alert">
            {errors.fullName}
          </span>
        )}
      </div>

      <div className="lead-form__field">
        <label htmlFor="lead-phone-number">Phone Number</label>
        <input
          id="lead-phone-number"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          value={values.phoneNumber}
          onChange={handleChange}
          aria-invalid={Boolean(errors.phoneNumber)}
          aria-describedby={
            errors.phoneNumber ? 'lead-phone-number-error' : undefined
          }
          ref={(element) => {
            fieldRefs.current.phoneNumber = element
          }}
        />
        {errors.phoneNumber && (
          <span
            className="lead-form__error"
            id="lead-phone-number-error"
            role="alert"
          >
            {errors.phoneNumber}
          </span>
        )}
      </div>

      <div className="lead-form__field">
        <label htmlFor="lead-email">Email</label>
        <input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'lead-email-error' : undefined}
          ref={(element) => {
            fieldRefs.current.email = element
          }}
        />
        {errors.email && (
          <span className="lead-form__error" id="lead-email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {submissionError && (
        <p className="lead-form__error" role="alert">
          {submissionError}
        </p>
      )}

      <button
        className="lead-form__submit"
        type="submit"
        disabled={submissionStatus === 'loading'}
      >
        {submissionStatus === 'loading'
          ? 'Submitting…'
          : 'Request Free Consultation'}
      </button>
    </form>
  )
}

export default LeadCaptureForm
