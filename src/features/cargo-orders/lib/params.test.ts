import { describe, expect, it } from 'vitest'

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants'
import {
  getLastPage,
  normalizeListParams,
  parsePageParam,
  parsePerPageParam,
  parseStatusParam,
} from './params'

describe('normalizeListParams', () => {
  it('keeps only pagination when no filter is active', () => {
    expect(normalizeListParams({ page: 2, per_page: 10 })).toEqual({ page: 2, per_page: 10 })
  })

  it('drops blank and whitespace-only filters so the query key stays stable', () => {
    expect(
      normalizeListParams({ page: 1, per_page: 5, origin_city: '   ', search: '' }),
    ).toEqual({ page: 1, per_page: 5 })
  })

  it('trims filter values', () => {
    expect(
      normalizeListParams({ page: 1, per_page: 5, origin_city: ' Tehran ', search: ' steel ' }),
    ).toEqual({ page: 1, per_page: 5, origin_city: 'Tehran', search: 'steel' })
  })

  it('falls back to defaults for invalid pagination', () => {
    expect(normalizeListParams({ page: 0, per_page: -5 })).toEqual({
      page: DEFAULT_PAGE,
      per_page: DEFAULT_PER_PAGE,
    })
  })
})

describe('parsePageParam', () => {
  it('accepts positive integers', () => {
    expect(parsePageParam('3')).toBe(3)
  })

  it('rejects anything else', () => {
    expect(parsePageParam(null)).toBe(DEFAULT_PAGE)
    expect(parsePageParam('0')).toBe(DEFAULT_PAGE)
    expect(parsePageParam('-2')).toBe(DEFAULT_PAGE)
    expect(parsePageParam('1.5')).toBe(DEFAULT_PAGE)
    expect(parsePageParam('abc')).toBe(DEFAULT_PAGE)
  })
})

describe('parsePerPageParam', () => {
  it('only accepts values offered by the page size selector', () => {
    expect(parsePerPageParam('10')).toBe(10)
    expect(parsePerPageParam('7')).toBe(DEFAULT_PER_PAGE)
    expect(parsePerPageParam(null)).toBe(DEFAULT_PER_PAGE)
  })
})

describe('parseStatusParam', () => {
  it('accepts known statuses', () => {
    expect(parseStatusParam('in_progress')).toBe('in_progress')
  })

  it('ignores unknown statuses', () => {
    expect(parseStatusParam('archived')).toBeUndefined()
    expect(parseStatusParam(null)).toBeUndefined()
  })
})

describe('getLastPage', () => {
  it('computes the last page for a given page size', () => {
    expect(getLastPage(15, 5)).toBe(3)
    expect(getLastPage(16, 5)).toBe(4)
  })

  it('never returns a page below the first one', () => {
    expect(getLastPage(0, 5)).toBe(1)
  })
})
