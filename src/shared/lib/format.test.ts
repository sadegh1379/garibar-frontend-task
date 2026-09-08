import { describe, expect, it } from 'vitest'

import { formatDateTime, formatDecimal, formatInteger, formatPriceRial, formatWeightTon } from './format'

describe('formatInteger', () => {
  it('adds thousand separators', () => {
    expect(formatInteger(85_000_000)).toBe('85,000,000')
  })

  it('rounds away fractional digits', () => {
    expect(formatInteger(1234.6)).toBe('1,235')
  })

  it('falls back to a placeholder for non-finite values', () => {
    expect(formatInteger(Number.NaN)).toBe('—')
    expect(formatInteger(Number.POSITIVE_INFINITY)).toBe('—')
  })
})

describe('formatDecimal', () => {
  it('keeps at most two fractional digits', () => {
    expect(formatDecimal(18)).toBe('18')
    expect(formatDecimal(18.456)).toBe('18.46')
  })
})

describe('formatPriceRial', () => {
  it('formats a price with separators and unit', () => {
    expect(formatPriceRial(62_000_000)).toBe('62,000,000 rial')
  })
})

describe('formatWeightTon', () => {
  it('formats a weight with the ton unit', () => {
    expect(formatWeightTon(24.5)).toBe('24.5 t')
  })
})

describe('formatDateTime', () => {
  it('renders a readable date for an ISO string', () => {
    expect(formatDateTime('2026-01-10T08:00:00.000Z')).toContain('2026')
  })

  it('falls back to a placeholder for an unparsable date', () => {
    expect(formatDateTime('not-a-date')).toBe('—')
  })
})
