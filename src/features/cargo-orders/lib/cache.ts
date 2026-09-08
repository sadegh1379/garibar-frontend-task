import type { QueryClient, QueryKey } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/shared/types/pagination'

import { cargoOrderKeys } from '../api/cargoOrders.keys'
import type { CargoOrder } from '../types'

type CargoOrderList = PaginatedResponse<CargoOrder>

export type CargoOrderListsSnapshot = Array<[QueryKey, CargoOrderList | undefined]>

const listsFilter = { queryKey: cargoOrderKeys.lists() }

export const snapshotCargoOrderLists = (queryClient: QueryClient): CargoOrderListsSnapshot =>
  queryClient.getQueriesData<CargoOrderList>(listsFilter)

export const restoreCargoOrderLists = (
  queryClient: QueryClient,
  snapshot: CargoOrderListsSnapshot,
): void => {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data)
  }
}

export const replaceCargoOrderInLists = (queryClient: QueryClient, order: CargoOrder): void => {
  queryClient.setQueriesData<CargoOrderList>(listsFilter, (current) => {
    if (!current?.data.some((item) => item.id === order.id)) {
      return current
    }

    return {
      ...current,
      data: current.data.map((item) => (item.id === order.id ? order : item)),
    }
  })
}

export const removeCargoOrderFromLists = (queryClient: QueryClient, orderId: number): void => {
  queryClient.setQueriesData<CargoOrderList>(listsFilter, (current) => {
    if (!current?.data.some((item) => item.id === orderId)) {
      return current
    }

    return {
      ...current,
      data: current.data.filter((item) => item.id !== orderId),
      total: Math.max(0, current.total - 1),
    }
  })
}
