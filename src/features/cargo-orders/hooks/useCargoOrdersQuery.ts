import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { cargoOrdersApi } from '../api/cargoOrders.api'
import { cargoOrderKeys } from '../api/cargoOrders.keys'
import type { CargoOrderListParams } from '../types'

/**
 * `keepPreviousData` keeps the previous page on screen while the next one loads, so
 * paging and filtering never collapse the table back to a skeleton.
 */
export const useCargoOrdersQuery = (params: CargoOrderListParams) =>
  useQuery({
    queryKey: cargoOrderKeys.list(params),
    queryFn: () => cargoOrdersApi.getList(params),
    placeholderData: keepPreviousData,
  })
