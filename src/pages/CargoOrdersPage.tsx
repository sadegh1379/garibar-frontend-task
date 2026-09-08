import { useCallback, useEffect, useMemo, useState } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import { App, Button, Card, Typography } from 'antd'

import { CargoOrderFormModal } from '@/features/cargo-orders/components/CargoOrderFormModal'
import { CargoOrdersFilters } from '@/features/cargo-orders/components/CargoOrdersFilters'
import { CargoOrdersTable } from '@/features/cargo-orders/components/CargoOrdersTable'
import { createCargoOrdersColumns } from '@/features/cargo-orders/components/cargoOrdersColumns'
import { DEFAULT_PAGE } from '@/features/cargo-orders/constants'
import { useCargoOrderListParams } from '@/features/cargo-orders/hooks/useCargoOrderListParams'
import { useCargoOrdersQuery } from '@/features/cargo-orders/hooks/useCargoOrdersQuery'
import { useDeleteCargoOrder } from '@/features/cargo-orders/hooks/useDeleteCargoOrder'
import { getLastPage } from '@/features/cargo-orders/lib/params'
import type { CargoOrder } from '@/features/cargo-orders/types'
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

  const { message } = App.useApp()
  const ordersQuery = useCargoOrdersQuery(listParams)
  const deleteOrder = useDeleteCargoOrder()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<CargoOrder | null>(null)

  const orders = ordersQuery.data?.data ?? []
  const total = ordersQuery.data?.total ?? 0

  const openCreateForm = useCallback(() => {
    setEditingOrder(null)
    setIsFormOpen(true)
  }, [])

  const openEditForm = useCallback((order: CargoOrder) => {
    setEditingOrder(order)
    setIsFormOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (order: CargoOrder) => {
      try {
        await deleteOrder.mutateAsync(order.id)
        message.success(`Cargo order #${order.id} deleted`)
      } catch (error) {
        message.error(getErrorMessage(error, 'Could not delete the cargo order'))
      }
    },
    [deleteOrder, message],
  )

  const columns = useMemo(
    () =>
      createCargoOrdersColumns({
        onEdit: openEditForm,
        onDelete: (order) => void handleDelete(order),
        deletingOrderId: deleteOrder.isPending ? (deleteOrder.variables ?? null) : null,
      }),
    [deleteOrder.isPending, deleteOrder.variables, handleDelete, openEditForm],
  )

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

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
          New cargo order
        </Button>
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

      <CargoOrderFormModal
        open={isFormOpen}
        order={editingOrder}
        onClose={() => setIsFormOpen(false)}
        onCreated={() => setPagination(DEFAULT_PAGE, perPage)}
      />
    </>
  )
}
