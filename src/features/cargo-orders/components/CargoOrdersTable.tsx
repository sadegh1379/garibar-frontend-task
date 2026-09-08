import type { TableColumnsType } from 'antd'
import { Button, Empty, Table } from 'antd'

import { formatInteger } from '@/shared/lib/format'

import { PER_PAGE_OPTIONS } from '../constants'
import type { CargoOrder } from '../types'

interface CargoOrdersTableProps {
  orders: CargoOrder[]
  columns: TableColumnsType<CargoOrder>
  total: number
  page: number
  perPage: number
  isLoading: boolean
  hasActiveFilters: boolean
  onPaginationChange: (page: number, perPage: number) => void
  onResetFilters: () => void
}

export const CargoOrdersTable = ({
  orders,
  columns,
  total,
  page,
  perPage,
  isLoading,
  hasActiveFilters,
  onPaginationChange,
  onResetFilters,
}: CargoOrdersTableProps) => (
  <Table<CargoOrder>
    rowKey="id"
    size="medium"
    columns={columns}
    dataSource={orders}
    loading={isLoading}
    scroll={{ x: 'max-content' }}
    locale={{
      emptyText: (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hasActiveFilters ? 'No cargo orders match these filters' : 'No cargo orders yet'
          }
        >
          {hasActiveFilters ? <Button onClick={onResetFilters}>Reset filters</Button> : null}
        </Empty>
      ),
    }}
    pagination={{
      current: page,
      pageSize: perPage,
      total,
      showSizeChanger: true,
      pageSizeOptions: PER_PAGE_OPTIONS.map(String),
      showTotal: (totalItems, [from, to]) =>
        `${from}–${to} of ${formatInteger(totalItems)} orders`,
    }}
    onChange={(pagination) => {
      onPaginationChange(pagination.current ?? page, pagination.pageSize ?? perPage)
    }}
  />
)
