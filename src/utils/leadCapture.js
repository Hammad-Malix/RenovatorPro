export function validateLeadDetails({ fullName, phoneNumber, email }) {
  const errors = {}
  const normalizedName = fullName.trim()
  const normalizedPhone = phoneNumber.trim()
  const normalizedEmail = email.trim()
  const phoneDigits = normalizedPhone.replace(/\D/g, '')

  if (!normalizedName) {
    errors.fullName = 'Enter your full name.'
  }

  if (
    !/^\+?[\d\s().-]+$/.test(normalizedPhone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phoneNumber = 'Enter a valid phone number with 7 to 15 digits.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function createLeadSubmissionPayload(
  { fullName, phoneNumber, email },
  estimate,
) {
  return {
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    email: email.trim().toLowerCase(),
    estimate: {
      ...estimate,
      priceRange: { ...estimate.priceRange },
      timelineRange: { ...estimate.timelineRange },
    },
  }
}

export async function submitLead(
  payload,
  { endpoint, accessKey = '' },
  fetchImpl = globalThis.fetch,
) {
  if (!endpoint) {
    throw new Error(
      'Lead submission is not configured. Set leadSubmission.endpoint in builderConfig.js.',
    )
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('Lead submission is unavailable in this environment.')
  }

  const requestPayload = accessKey
    ? { ...payload, access_key: accessKey }
    : payload
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestPayload),
  })

  if (!response.ok) {
    throw new Error(
      `Lead submission failed (HTTP ${response.status}). Please try again.`,
    )
  }

  return payload
}
