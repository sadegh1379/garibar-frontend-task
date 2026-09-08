import { describe, expect, it } from 'vitest'

import type { CargoOrder } from '../types'
import { createFormInitialValues, toCargoOrderPayload } from './form'

const order: CargoOrder = {
  id: 1,
  goods_name: 'Steel coils',
  origin_city: 'Tehran',
  destination_city: 'Isfahan',
  weight_ton: 18,
  price_rial: 85_000_000,
  status: 'open',
  created_at: '2026-01-10T08:00:00.000Z',
  description: 'Needs covered truck',
}

describe('createFormInitialValues', () => {
  it('defaults a new order to the open status', () => {
    expect(createFormInitialValues(null)).toEqual({ status: 'open' })
  })

  it('maps an existing order onto the form fields', () => {
    expect(createFormInitialValues(order)).toEqual({
      goods_name: 'Steel coils',
      origin_city: 'Tehran',
      destination_city: 'Isfahan',
      weight_ton: 18,
      price_rial: 85_000_000,
      status: 'open',
      description: 'Needs covered truck',
    })
  })

  it('turns a missing description into an empty field', () => {
    const { description, ...withoutDescription } = order

    expect(createFormInitialValues(withoutDescription)).toMatchObject({ description: '' })
    expect(description).toBe('Needs covered truck')
  })
})

describe('toCargoOrderPayload', () => {
  it('trims every text field', () => {
    expect(
      toCargoOrderPayload({
        goods_name: '  Wheat  ',
        origin_city: ' Mashhad ',
        destination_city: ' Tehran ',
        weight_ton: 24,
        price_rial: 62_000_000,
        status: 'in_progress',
        description: '  Fragile  ',
      }),
    ).toEqual({
      goods_name: 'Wheat',
      origin_city: 'Mashhad',
      destination_city: 'Tehran',
      weight_ton: 24,
      price_rial: 62_000_000,
      status: 'in_progress',
      description: 'Fragile',
    })
  })

  it('omits a blank description instead of sending an empty string', () => {
    const payload = toCargoOrderPayload({
      goods_name: 'Wheat',
      origin_city: 'Mashhad',
      destination_city: 'Tehran',
      weight_ton: 24,
      price_rial: 62_000_000,
      status: 'open',
      description: '   ',
    })

    expect(payload).not.toHaveProperty('description')
  })
})
