import { Tag } from 'antd'

import { CARGO_ORDER_STATUS_COLORS, CARGO_ORDER_STATUS_LABELS } from '../constants'
import type { CargoOrderStatus } from '../types'

interface CargoOrderStatusTagProps {
  status: CargoOrderStatus
}

export const CargoOrderStatusTag = ({ status }: CargoOrderStatusTagProps) => (
  <Tag color={CARGO_ORDER_STATUS_COLORS[status]}>{CARGO_ORDER_STATUS_LABELS[status]}</Tag>
)
