import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createLeadSubmissionPayload,
  submitLead,
  validateLeadDetails,
} from './leadCapture.js'

test('requires a full name, valid phone number, and valid email', () => {
  assert.deepEqual(
    validateLeadDetails({
      fullName: '  ',
      phoneNumber: 'call me',
      email: 'not-an-email',
    }),
    {
      fullName: 'Enter your full name.',
      phoneNumber: 'Enter a valid phone number with 7 to 15 digits.',
      email: 'Enter a valid email address.',
    },
  )

  assert.deepEqual(
    validateLeadDetails({
      fullName: 'Avery Example',
      phoneNumber: '+44 (0)20 7946 0958',
      email: 'avery@example.co.uk',
    }),
    {},
  )
})

test('creates a normalized payload containing the current estimate', () => {
  const estimate = {
    projectType: 'kitchen',
    projectTypeLabel: 'Kitchen Remodel',
    finishTier: 'midRange',
    finishTierLabel: 'Mid-Range',
    squareFeet: 180,
    currency: 'GBP',
    priceRange: { min: 43600, max: 55400 },
    timelineRange: { minWeeks: 4, maxWeeks: 6 },
  }

  assert.deepEqual(
    createLeadSubmissionPayload(
      {
        fullName: ' Avery Example ',
        phoneNumber: ' +44 20 7946 0958 ',
        email: ' AVERY@EXAMPLE.CO.UK ',
      },
      estimate,
    ),
    {
      fullName: 'Avery Example',
      phoneNumber: '+44 20 7946 0958',
      email: 'avery@example.co.uk',
      estimate,
    },
  )
})

test('posts the payload to the configured endpoint and rejects failed responses', async () => {
  const payload = {
    fullName: 'Avery Example',
    phoneNumber: '+44 20 7946 0958',
    email: 'avery@example.co.uk',
    estimate: {
      projectType: 'kitchen',
      priceRange: { min: 43600, max: 55400 },
    },
  }
  let request

  const result = await submitLead(
    payload,
    {
      endpoint: 'https://example.test/leads',
      accessKey: 'test-key',
    },
    async (...args) => {
      request = args
      return { ok: true, status: 200 }
    },
  )

  assert.equal(result, payload)
  assert.equal(request[0], 'https://example.test/leads')
  assert.equal(request[1].method, 'POST')
  assert.deepEqual(JSON.parse(request[1].body), {
    ...payload,
    access_key: 'test-key',
  })

  await assert.rejects(
    submitLead(
      payload,
      { endpoint: 'https://example.test/leads' },
      async () => ({
        ok: false,
        status: 503,
      }),
    ),
    /HTTP 503/,
  )
})

test('does not send a lead when no endpoint is configured', async () => {
  await assert.rejects(
    submitLead({ fullName: 'Avery' }, { endpoint: '' }),
    /Set leadSubmission\.endpoint/,
  )
})
