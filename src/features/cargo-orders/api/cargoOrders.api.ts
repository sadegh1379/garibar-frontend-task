import {
  createCargoOrder,
  deleteCargoOrder,
  getCargoOrders,
  updateCargoOrder,
} from '@/mock/mockApi'
import type { PaginatedResponse } from '@/shared/types/pagination'

import type {
  CargoOrder,
  CargoOrderListParams,
  CargoOrderPayload,
  CargoOrderUpdatePayload,
} from '../types'

/**
 * The only seam between this feature and its data source. Moving from the bundled mock
 * to a real backend (axios/fetch) is a rewrite of this file and nothing else.
 */
export const cargoOrdersApi = {
  getList: (params: CargoOrderListParams): Promise<PaginatedResponse<CargoOrder>> =>
    getCargoOrders(params),

  create: async (payload: CargoOrderPayload): Promise<CargoOrder> => {
    const { data } = await createCargoOrder(payload)

    return data
  },

  update: async (id: number, payload: CargoOrderUpdatePayload): Promise<CargoOrder> => {
    const { data } = await updateCargoOrder(id, payload)

    return data
  },

  remove: async (id: number): Promise<string> => {
    const { message } = await deleteCargoOrder(id)

    return message
  },
}
