const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.'

/**
 * The mock API rejects with plain `Error` instances (e.g. "Cargo order not found"),
 * so surfacing `error.message` gives the user the most accurate feedback available.
 */
export const getErrorMessage = (
  error: unknown,
  fallback: string = FALLBACK_ERROR_MESSAGE,
): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim()
  }

  return fallback
}
