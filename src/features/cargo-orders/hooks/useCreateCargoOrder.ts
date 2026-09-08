import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cargoOrdersApi } from '../api/cargoOrders.api'
import { cargoOrderKeys } from '../api/cargoOrders.keys'
import type { CargoOrderPayload } from '../types'

export const useCreateCargoOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CargoOrderPayload) => cargoOrdersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cargoOrderKeys.lists() }),
  })
}
