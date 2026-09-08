import { DEFAULT_PAGE, DEFAULT_PER_PAGE, PER_PAGE_OPTIONS } from '../constants'
import { isCargoOrderStatus, type CargoOrderListParams, type CargoOrderStatus } from '../types'

/**
 * Drops blank filters and clamps pagination so that equivalent filter states always
 * produce an identical object. React Query hashes this into the query key, so any
 * stray `''` value would silently create a duplicate cache entry.
 */
export const normalizeListParams = (input: CargoOrderListParams): CargoOrderListParams => {
  const normalized: CargoOrderListParams = {
    page: Number.isInteger(input.page) && input.page > 0 ? input.page : DEFAULT_PAGE,
    per_page: Number.isInteger(input.per_page) && input.per_page > 0 ? input.per_page : DEFAULT_PER_PAGE,
  }

  if (input.status) {
    normalized.status = input.status
  }

  const originCity = input.origin_city?.trim()
  if (originCity) {
    normalized.origin_city = originCity
  }

  const search = input.search?.trim()
  if (search) {
    normalized.search = search
  }

  return normalized
}

export const parsePageParam = (rawValue: string | null): number => {
  const page = Number(rawValue)

  return Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE
}

export const parsePerPageParam = (rawValue: string | null): number => {
  const perPage = Number(rawValue)

  return PER_PAGE_OPTIONS.some((option) => option === perPage) ? perPage : DEFAULT_PER_PAGE
}

export const parseStatusParam = (rawValue: string | null): CargoOrderStatus | undefined =>
  isCargoOrderStatus(rawValue) ? rawValue : undefined

export const getLastPage = (total: number, perPage: number): number =>
  Math.max(DEFAULT_PAGE, Math.ceil(total / perPage))
