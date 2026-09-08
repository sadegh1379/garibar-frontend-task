import type { ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { App as AntdApp, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { BrowserRouter } from 'react-router-dom'

import { queryClient } from './queryClient'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider locale={enUS} theme={{ token: { borderRadius: 8 } }}>
      {/* antd's <App> is what makes the contextual `message` / `modal` hooks theme-aware. */}
      <AntdApp>
        <BrowserRouter>{children}</BrowserRouter>
      </AntdApp>
    </ConfigProvider>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  </QueryClientProvider>
)
