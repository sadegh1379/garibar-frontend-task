import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('steel', 400))

    expect(result.current).toBe('steel')
  })

  it('keeps the previous value until the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: 'steel' },
    })

    rerender({ value: 'wheat' })
    expect(result.current).toBe('steel')

    act(() => {
      vi.advanceTimersByTime(399)
    })
    expect(result.current).toBe('steel')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('wheat')
  })

  it('only emits the last value of a burst of changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: '' },
    })

    for (const value of ['w', 'wh', 'whe', 'whea', 'wheat']) {
      rerender({ value })
      act(() => {
        vi.advanceTimersByTime(100)
      })
    }

    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe('wheat')
  })
})
