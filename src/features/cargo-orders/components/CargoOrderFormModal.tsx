import { App, Form, Input, InputNumber, Modal, Select, Typography } from 'antd'

import { getErrorMessage } from '@/shared/lib/errors'
import { formatPriceRial } from '@/shared/lib/format'

import { CARGO_ORDER_STATUS_OPTIONS } from '../constants'
import { useCreateCargoOrder } from '../hooks/useCreateCargoOrder'
import { useUpdateCargoOrder } from '../hooks/useUpdateCargoOrder'
import { createFormInitialValues, toCargoOrderPayload } from '../lib/form'
import type { CargoOrder, CargoOrderFormValues } from '../types'

const { Text } = Typography

interface CargoOrderFormModalProps {
  open: boolean
  /** `null` opens the modal in create mode. */
  order: CargoOrder | null
  onClose: () => void
  onCreated: () => void
}

export const CargoOrderFormModal = ({
  open,
  order,
  onClose,
  onCreated,
}: CargoOrderFormModalProps) => {
  const [form] = Form.useForm<CargoOrderFormValues>()
  const { message } = App.useApp()

  const createOrder = useCreateCargoOrder()
  const updateOrder = useUpdateCargoOrder()

  const isEditing = order !== null
  const isSubmitting = createOrder.isPending || updateOrder.isPending

  const price = Form.useWatch('price_rial', form)

  const handleFinish = async (values: CargoOrderFormValues) => {
    const payload = toCargoOrderPayload(values)

    try {
      if (order) {
        await updateOrder.mutateAsync({ id: order.id, payload })
        message.success(`Cargo order #${order.id} updated`)
      } else {
        const created = await createOrder.mutateAsync(payload)
        message.success(`Cargo order #${created.id} created`)
        onCreated()
      }

      onClose()
    } catch (error) {
      message.error(getErrorMessage(error, 'Could not save the cargo order'))
    }
  }

  return (
    <Modal
      open={open}
      title={isEditing ? `Edit cargo order #${order.id}` : 'New cargo order'}
      okText={isEditing ? 'Save changes' : 'Create order'}
      cancelText="Cancel"
      confirmLoading={isSubmitting}
      onOk={() => form.submit()}
      onCancel={onClose}
      mask={{ closable: false }}
      destroyOnHidden
      width={640}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={createFormInitialValues(order)}
        onFinish={handleFinish}
        disabled={isSubmitting}
        preserve={false}
      >
        <Form.Item
          name="goods_name"
          label="Goods name"
          rules={[
            { required: true, whitespace: true, message: 'Goods name is required' },
            { max: 120, message: 'Goods name must be 120 characters or fewer' },
          ]}
        >
          <Input placeholder="e.g. Steel coils" autoFocus />
        </Form.Item>

        <Form.Item
          name="origin_city"
          label="Origin city"
          rules={[{ required: true, whitespace: true, message: 'Origin city is required' }]}
        >
          <Input placeholder="e.g. Tehran" />
        </Form.Item>

        <Form.Item
          name="destination_city"
          label="Destination city"
          rules={[{ required: true, whitespace: true, message: 'Destination city is required' }]}
        >
          <Input placeholder="e.g. Isfahan" />
        </Form.Item>

        <Form.Item
          name="weight_ton"
          label="Weight (tons)"
          rules={[
            { required: true, message: 'Weight is required' },
            { type: 'number', min: 0.01, message: 'Weight must be greater than 0' },
          ]}
        >
          <InputNumber min={0} placeholder="18" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="price_rial"
          label="Price (rial)"
          rules={[
            { required: true, message: 'Price is required' },
            { type: 'number', min: 1, message: 'Price must be greater than 0' },
          ]}
          extra={
            typeof price === 'number' && price > 0 ? (
              <Text type="secondary">{formatPriceRial(price)}</Text>
            ) : null
          }
        >
          <InputNumber min={0} step={1_000_000} placeholder="85000000" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Status is required' }]}
        >
          <Select options={CARGO_ORDER_STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: 'Description must be 500 characters or fewer' }]}
        >
          <Input.TextArea rows={3} placeholder="Optional notes, e.g. Needs covered truck" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
