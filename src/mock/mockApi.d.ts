/**
 * Type contract for the untyped `mockApi.js` shipped with the assignment.
 *
 * TypeScript resolves `./mockApi` to this declaration file while the bundler
 * resolves it to `mockApi.js`, which keeps the provided mock byte-for-byte
 * unchanged and still gives every call site full type safety.
 */
import type {
  CargoOrder,
  CargoOrderListParams,
  CargoOrderPayload,
  CargoOrderUpdatePayload,
} from '@/features/cargo-orders/types'
import type { PaginatedResponse } from '@/shared/types/pagination'

export declare function getCargoOrders(
  params?: CargoOrderListParams,
): Promise<PaginatedResponse<CargoOrder>>

export declare function createCargoOrder(
  payload: CargoOrderPayload,
): Promise<{ data: CargoOrder }>

export declare function updateCargoOrder(
  id: number,
  payload: CargoOrderUpdatePayload,
): Promise<{ data: CargoOrder }>

export declare function deleteCargoOrder(id: number): Promise<{ message: string }>
