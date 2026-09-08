import { describe, expect, it } from 'vitest'

import { getErrorMessage } from './errors'

describe('getErrorMessage', () => {
  it('uses the message of an Error instance', () => {
    expect(getErrorMessage(new Error('Cargo order not found'))).toBe('Cargo order not found')
  })

  it('accepts a plain string', () => {
    expect(getErrorMessage('  weight_ton must be a positive number  ')).toBe(
      'weight_ton must be a positive number',
    )
  })

  it('falls back when the error carries no usable message', () => {
    expect(getErrorMessage(new Error('   '))).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage({ code: 500 })).toBe('Something went wrong. Please try again.')
  })

  it('supports a custom fallback', () => {
    expect(getErrorMessage(undefined, 'Could not delete the order')).toBe(
      'Could not delete the order',
    )
  })
})
