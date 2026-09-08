import { Layout, Typography } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CargoOrdersPage } from '@/pages/CargoOrdersPage'

const { Header, Content } = Layout
const { Title, Text } = Typography

export const App = () => (
  <Layout className="app-layout">
    <Header className="app-header">
      <Title level={4} className="app-header__brand">
        Garibar
      </Title>
      <Text className="app-header__subtitle">Logistics admin</Text>
    </Header>

    <Content className="app-content">
      <Routes>
        <Route path="/" element={<CargoOrdersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Content>
  </Layout>
)
