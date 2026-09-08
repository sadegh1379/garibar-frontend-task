import type { CargoOrder, CargoOrderFormValues, CargoOrderPayload } from '../types'

export const createFormInitialValues = (
  order: CargoOrder | null,
): Partial<CargoOrderFormValues> => {
  if (!order) {
    return { status: 'open' }
  }

  return {
    goods_name: order.goods_name,
    origin_city: order.origin_city,
    destination_city: order.destination_city,
    weight_ton: order.weight_ton,
    price_rial: order.price_rial,
    status: order.status,
    description: order.description ?? '',
  }
}

/**
 * Mirrors what the API accepts: trimmed strings and an omitted (not empty) description,
 * which is exactly how the mock stores optional descriptions.
 */
export const toCargoOrderPayload = (values: CargoOrderFormValues): CargoOrderPayload => {
  const description = values.description?.trim()

  return {
    goods_name: values.goods_name.trim(),
    origin_city: values.origin_city.trim(),
    destination_city: values.destination_city.trim(),
    weight_ton: values.weight_ton,
    price_rial: values.price_rial,
    status: values.status,
    ...(description ? { description } : {}),
  }
}
