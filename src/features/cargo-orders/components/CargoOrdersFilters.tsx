import type { ReactNode } from 'react'

import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Input, Row, Select, Typography } from 'antd'

import { ALL_STATUSES, CARGO_ORDER_STATUS_FILTER_OPTIONS } from '../constants'
import type { CargoOrderStatus } from '../types'

const { Text } = Typography

type StatusFilterValue = CargoOrderStatus | typeof ALL_STATUSES

interface CargoOrdersFiltersProps {
  status: CargoOrderStatus | undefined
  originCity: string
  search: string
  isDebouncing: boolean
  hasActiveFilters: boolean
  onStatusChange: (status: CargoOrderStatus | undefined) => void
  onOriginCityChange: (value: string) => void
  onSearchChange: (value: string) => void
  onReset: () => void
}

interface FilterFieldProps {
  label: string
  children: ReactNode
}

const FilterField = ({ label, children }: FilterFieldProps) => (
  <Flex vertical gap={4}>
    <Text type="secondary" style={{ fontSize: 12 }}>
      {label}
    </Text>
    {children}
  </Flex>
)

export const CargoOrdersFilters = ({
  status,
  originCity,
  search,
  isDebouncing,
  hasActiveFilters,
  onStatusChange,
  onOriginCityChange,
  onSearchChange,
  onReset,
}: CargoOrdersFiltersProps) => (
  <Card size="small" style={{ marginBottom: 16 }}>
    <Row gutter={[16, 12]} align="bottom">
      <Col xs={24} sm={12} lg={5}>
        <FilterField label="Status">
          <Select
            value={status ?? ALL_STATUSES}
            options={CARGO_ORDER_STATUS_FILTER_OPTIONS}
            onChange={(value: StatusFilterValue) => onStatusChange(value === ALL_STATUSES ? undefined : value)}
            style={{ width: '100%' }}
          />
        </FilterField>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <FilterField label="Origin city">
          <Input
            value={originCity}
            onChange={(event) => onOriginCityChange(event.target.value)}
            placeholder="e.g. Tehran"
            allowClear
          />
        </FilterField>
      </Col>

      <Col xs={24} sm={16} lg={9}>
        <FilterField label="Goods">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by goods name"
            prefix={isDebouncing ? <LoadingOutlined /> : <SearchOutlined />}
            allowClear
          />
        </FilterField>
      </Col>

      <Col xs={24} sm={8} lg={4}>
        <Button block onClick={onReset} disabled={!hasActiveFilters}>
          Reset filters
        </Button>
      </Col>
    </Row>
  </Card>
)
