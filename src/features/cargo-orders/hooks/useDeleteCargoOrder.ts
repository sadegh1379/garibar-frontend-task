import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cargoOrdersApi } from '../api/cargoOrders.api'
import { cargoOrderKeys } from '../api/cargoOrders.keys'
import {
  removeCargoOrderFromLists,
  restoreCargoOrderLists,
  snapshotCargoOrderLists,
} from '../lib/cache'

export const useDeleteCargoOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => cargoOrdersApi.remove(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: cargoOrderKeys.lists() })

      const snapshot = snapshotCargoOrderLists(queryClient)
      removeCargoOrderFromLists(queryClient, orderId)

      return { snapshot }
    },
    onError: (_error, _orderId, context) => {
      if (context) {
        restoreCargoOrderLists(queryClient, context.snapshot)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cargoOrderKeys.lists() }),
  })
}
