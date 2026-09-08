import { CARGO_ORDER_STATUSES, type CargoOrderStatus } from './types'

export const DEFAULT_PAGE = 1
export const DEFAULT_PER_PAGE = 5
export const PER_PAGE_OPTIONS = [5, 10, 20] as const

export const TEXT_FILTER_DEBOUNCE_MS = 400

export const CARGO_ORDER_STATUS_LABELS: Record<CargoOrderStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  closed: 'Closed',
}

export const CARGO_ORDER_STATUS_COLORS: Record<CargoOrderStatus, string> = {
  open: 'blue',
  in_progress: 'gold',
  closed: 'default',
}

export const CARGO_ORDER_STATUS_OPTIONS = CARGO_ORDER_STATUSES.map((status) => ({
  value: status,
  label: CARGO_ORDER_STATUS_LABELS[status],
}))

/** Sentinel for the "All" entry of the status filter, since `undefined` is not selectable. */
export const ALL_STATUSES = 'all'

export const CARGO_ORDER_STATUS_FILTER_OPTIONS = [
  { value: ALL_STATUSES, label: 'All statuses' },
  ...CARGO_ORDER_STATUS_OPTIONS,
]
