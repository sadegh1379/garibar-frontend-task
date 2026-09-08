import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

import { DEFAULT_PAGE, DEFAULT_PER_PAGE, TEXT_FILTER_DEBOUNCE_MS } from '../constants'
import {
  normalizeListParams,
  parsePageParam,
  parsePerPageParam,
  parseStatusParam,
} from '../lib/params'
import type { CargoOrderListParams, CargoOrderStatus } from '../types'

type QueryParamName = 'page' | 'per_page' | 'status' | 'origin_city' | 'search'

type SearchParamsPatch = Partial<Record<QueryParamName, string | undefined>>

export interface CargoOrderListControls {
  listParams: CargoOrderListParams
  page: number
  perPage: number
  status: CargoOrderStatus | undefined
  originCityInput: string
  searchInput: string
  isDebouncingFilters: boolean
  hasActiveFilters: boolean
  setStatus: (status: CargoOrderStatus | undefined) => void
  setOriginCityInput: (value: string) => void
  setSearchInput: (value: string) => void
  setPagination: (page: number, perPage: number) => void
  resetFilters: () => void
}

/**
 * Owns everything the list needs: pagination, filters and their debounce.
 *
 * The URL is the single source of truth, which makes the current view shareable and
 * survives a refresh. Text filters reach the URL only once their debounce has settled,
 * so typing does not fire a request per keystroke.
 */
export const useCargoOrderListParams = (): CargoOrderListControls => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parsePageParam(searchParams.get('page'))
  const perPage = parsePerPageParam(searchParams.get('per_page'))
  const status = parseStatusParam(searchParams.get('status'))
  const originCity = searchParams.get('origin_city') ?? ''
  const search = searchParams.get('search') ?? ''

  const [originCityInput, setOriginCityInput] = useState(originCity)
  const [searchInput, setSearchInput] = useState(search)

  const debouncedOriginCity = useDebouncedValue(originCityInput, TEXT_FILTER_DEBOUNCE_MS)
  const debouncedSearch = useDebouncedValue(searchInput, TEXT_FILTER_DEBOUNCE_MS)

  const isDebouncingFilters =
    debouncedOriginCity !== originCityInput || debouncedSearch !== searchInput

  const updateSearchParams = useCallback(
    (patch: SearchParamsPatch, options: { resetPage?: boolean } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)

          for (const [name, value] of Object.entries(patch)) {
            if (value) {
              next.set(name, value)
            } else {
              next.delete(name)
            }
          }

          if (options.resetPage) {
            next.delete('page')
          }

          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    // Skipping while a debounce is in flight is what makes "Reset filters" instant:
    // the pending stale value can never be written back over the cleared URL.
    if (isDebouncingFilters) return
    if (debouncedSearch === search && debouncedOriginCity === originCity) return

    updateSearchParams(
      { search: debouncedSearch, origin_city: debouncedOriginCity },
      { resetPage: true },
    )
  }, [
    debouncedOriginCity,
    debouncedSearch,
    isDebouncingFilters,
    originCity,
    search,
    updateSearchParams,
  ])

  const setStatus = useCallback(
    (nextStatus: CargoOrderStatus | undefined) => {
      updateSearchParams({ status: nextStatus }, { resetPage: true })
    },
    [updateSearchParams],
  )

  const setPagination = useCallback(
    (nextPage: number, nextPerPage: number) => {
      updateSearchParams({
        page: nextPage === DEFAULT_PAGE ? undefined : String(nextPage),
        per_page: nextPerPage === DEFAULT_PER_PAGE ? undefined : String(nextPerPage),
      })
    },
    [updateSearchParams],
  )

  const resetFilters = useCallback(() => {
    setOriginCityInput('')
    setSearchInput('')
    updateSearchParams(
      { status: undefined, origin_city: undefined, search: undefined },
      { resetPage: true },
    )
  }, [updateSearchParams])

  const listParams = useMemo(
    () => normalizeListParams({ page, per_page: perPage, status, origin_city: originCity, search }),
    [originCity, page, perPage, search, status],
  )

  return {
    listParams,
    page,
    perPage,
    status,
    originCityInput,
    searchInput,
    isDebouncingFilters,
    hasActiveFilters: Boolean(status || originCityInput || searchInput),
    setStatus,
    setOriginCityInput,
    setSearchInput,
    setPagination,
    resetFilters,
  }
}
