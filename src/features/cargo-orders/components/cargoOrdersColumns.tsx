import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import { Button, Flex, Popconfirm, Tooltip, Typography } from 'antd'

import { formatDateTime, formatPriceRial, formatWeightTon } from '@/shared/lib/format'

import type { CargoOrder } from '../types'
import { CargoOrderStatusTag } from './CargoOrderStatusTag'

const { Text } = Typography

interface CargoOrdersColumnsOptions {
  onEdit: (order: CargoOrder) => void
  onDelete: (order: CargoOrder) => void
  deletingOrderId: number | null
}

export const createCargoOrdersColumns = ({
  onEdit,
  onDelete,
  deletingOrderId,
}: CargoOrdersColumnsOptions): TableColumnsType<CargoOrder> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (id: number) => <Text type="secondary">#{id}</Text>,
  },
  {
    title: 'Goods name',
    dataIndex: 'goods_name',
    key: 'goods_name',
    width: 200,
    render: (goodsName: string, order) =>
      order.description ? (
        <Tooltip title={order.description}>
          <Text underline>{goodsName}</Text>
        </Tooltip>
      ) : (
        goodsName
      ),
  },
  {
    title: 'Origin city',
    dataIndex: 'origin_city',
    key: 'origin_city',
    width: 140,
  },
  {
    title: 'Destination city',
    dataIndex: 'destination_city',
    key: 'destination_city',
    width: 160,
  },
  {
    title: 'Weight (tons)',
    dataIndex: 'weight_ton',
    key: 'weight_ton',
    width: 130,
    align: 'end',
    render: (weightTon: number) => formatWeightTon(weightTon),
  },
  {
    title: 'Price (rial)',
    dataIndex: 'price_rial',
    key: 'price_rial',
    width: 170,
    align: 'end',
    render: (priceRial: number) => formatPriceRial(priceRial),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 130,
    render: (_status, order) => <CargoOrderStatusTag status={order.status} />,
  },
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 170,
    responsive: ['xxl'],
    render: (createdAt: string) => <Text type="secondary">{formatDateTime(createdAt)}</Text>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 170,
    fixed: 'right',
    render: (_value, order) => (
      <Flex gap={4}>
        <Button size="small" type="text" icon={<EditOutlined />} onClick={() => onEdit(order)}>
          Edit
        </Button>

        <Popconfirm
          title="Delete this cargo order?"
          description={`"${order.goods_name}" will be removed permanently.`}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true, loading: deletingOrderId === order.id }}
          onConfirm={() => onDelete(order)}
        >
          <Button size="small" type="text" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </Flex>
    ),
  },
]
