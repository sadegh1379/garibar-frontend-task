import { useEffect, useMemo } from 'react'

import { Card, Typography } from 'antd'

import { CargoOrdersFilters } from '@/features/cargo-orders/components/CargoOrdersFilters'
import { CargoOrdersTable } from '@/features/cargo-orders/components/CargoOrdersTable'
import { createCargoOrdersColumns } from '@/features/cargo-orders/components/cargoOrdersColumns'
import { useCargoOrderListParams } from '@/features/cargo-orders/hooks/useCargoOrderListParams'
import { useCargoOrdersQuery } from '@/features/cargo-orders/hooks/useCargoOrdersQuery'
import { getLastPage } from '@/features/cargo-orders/lib/params'
import { getErrorMessage } from '@/shared/lib/errors'
import { ErrorState } from '@/shared/ui/ErrorState'

const { Title, Paragraph } = Typography

export const CargoOrdersPage = () => {
  const {
    listParams,
    page,
    perPage,
    status,
    originCityInput,
    searchInput,
    isDebouncingFilters,
    hasActiveFilters,
    setStatus,
    setOriginCityInput,
    setSearchInput,
    setPagination,
    resetFilters,
  } = useCargoOrderListParams()

  const ordersQuery = useCargoOrdersQuery(listParams)

  const orders = ordersQuery.data?.data ?? []
  const total = ordersQuery.data?.total ?? 0

  const columns = useMemo(() => createCargoOrdersColumns(), [])

  useEffect(() => {
    // Removing the last row of the last page (or narrowing the filters) can leave the
    // user stranded on a page that no longer exists.
    if (ordersQuery.isFetching || total === 0) return

    const lastPage = getLastPage(total, perPage)

    if (page > lastPage) {
      setPagination(lastPage, perPage)
    }
  }, [ordersQuery.isFetching, page, perPage, setPagination, total])

  return (
    <>
      <div className="page-header">
        <div>
          <Title level={3} className="page-header__title">
            Cargo orders
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Browse, filter and manage cargo orders.
          </Paragraph>
        </div>
      </div>

      <CargoOrdersFilters
        status={status}
        originCity={originCityInput}
        search={searchInput}
        isDebouncing={isDebouncingFilters}
        hasActiveFilters={hasActiveFilters}
        onStatusChange={setStatus}
        onOriginCityChange={setOriginCityInput}
        onSearchChange={setSearchInput}
        onReset={resetFilters}
      />

      {ordersQuery.isError ? (
        <Card>
          <ErrorState
            title="Could not load cargo orders"
            description={getErrorMessage(ordersQuery.error)}
            onRetry={() => void ordersQuery.refetch()}
            isRetrying={ordersQuery.isFetching}
          />
        </Card>
      ) : (
        <CargoOrdersTable
          orders={orders}
          columns={columns}
          total={total}
          page={page}
          perPage={perPage}
          isLoading={ordersQuery.isFetching}
          hasActiveFilters={hasActiveFilters}
          onPaginationChange={setPagination}
          onResetFilters={resetFilters}
        />
      )}
    </>
  )
}
