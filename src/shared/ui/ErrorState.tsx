import { Button, Result } from 'antd'

interface ErrorStateProps {
  title?: string
  description: string
  onRetry?: () => void
  isRetrying?: boolean
}

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) => (
  <Result
    status="error"
    title={title}
    subTitle={description}
    extra={
      onRetry ? (
        <Button type="primary" onClick={onRetry} loading={isRetrying}>
          Try again
        </Button>
      ) : undefined
    }
  />
)
