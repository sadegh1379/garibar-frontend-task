import type { CargoOrderListParams } from '../types'

/**
 * Hierarchical keys: invalidating `lists()` refreshes every filter/page combination
 * currently in the cache without having to know which ones exist.
 */
export const cargoOrderKeys = {
  all: ['cargo-orders'] as const,
  lists: () => [...cargoOrderKeys.all, 'list'] as const,
  list: (params: CargoOrderListParams) => [...cargoOrderKeys.lists(), params] as const,
}
