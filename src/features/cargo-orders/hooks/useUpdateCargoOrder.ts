import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cargoOrdersApi } from '../api/cargoOrders.api'
import { cargoOrderKeys } from '../api/cargoOrders.keys'
import { replaceCargoOrderInLists } from '../lib/cache'
import type { CargoOrderUpdatePayload } from '../types'

export interface UpdateCargoOrderVariables {
  id: number
  payload: CargoOrderUpdatePayload
}

export const useUpdateCargoOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCargoOrderVariables) => cargoOrdersApi.update(id, payload),
    onSuccess: (updatedOrder) => {
      // Patch the row in place for an instant update, then refetch so rows that no
      // longer match the active filters disappear.
      replaceCargoOrderInLists(queryClient, updatedOrder)

      return queryClient.invalidateQueries({ queryKey: cargoOrderKeys.lists() })
    },
  })
}
