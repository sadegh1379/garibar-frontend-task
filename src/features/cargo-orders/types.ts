export const CARGO_ORDER_STATUSES = ['open', 'in_progress', 'closed'] as const

export type CargoOrderStatus = (typeof CARGO_ORDER_STATUSES)[number]

export const isCargoOrderStatus = (value: unknown): value is CargoOrderStatus =>
  typeof value === 'string' && CARGO_ORDER_STATUSES.some((status) => status === value)

export interface CargoOrder {
  id: number
  goods_name: string
  origin_city: string
  destination_city: string
  weight_ton: number
  price_rial: number
  status: CargoOrderStatus
  created_at: string
  description?: string
}

/** Body accepted by `createCargoOrder`; `updateCargoOrder` accepts any subset of it. */
export interface CargoOrderPayload {
  goods_name: string
  origin_city: string
  destination_city: string
  weight_ton: number
  price_rial: number
  status: CargoOrderStatus
  description?: string
}

export type CargoOrderUpdatePayload = Partial<CargoOrderPayload>

export interface CargoOrderFilters {
  status?: CargoOrderStatus
  origin_city?: string
  search?: string
}

export interface CargoOrderListParams extends CargoOrderFilters {
  page: number
  per_page: number
}

export interface CargoOrderFormValues {
  goods_name: string
  origin_city: string
  destination_city: string
  weight_ton: number
  price_rial: number
  status: CargoOrderStatus
  description?: string
}
