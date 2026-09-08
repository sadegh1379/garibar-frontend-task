import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export const CargoOrdersPage = () => (
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
)
