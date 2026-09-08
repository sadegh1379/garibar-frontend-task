const EMPTY_PLACEHOLDER = '—'

const integerFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatInteger = (value: number): string =>
  Number.isFinite(value) ? integerFormatter.format(value) : EMPTY_PLACEHOLDER

export const formatDecimal = (value: number): string =>
  Number.isFinite(value) ? decimalFormatter.format(value) : EMPTY_PLACEHOLDER

export const formatPriceRial = (value: number): string => {
  if (!Number.isFinite(value)) return EMPTY_PLACEHOLDER

  return `${integerFormatter.format(value)} rial`
}

export const formatWeightTon = (value: number): string => {
  if (!Number.isFinite(value)) return EMPTY_PLACEHOLDER

  return `${decimalFormatter.format(value)} t`
}

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime()) ? EMPTY_PLACEHOLDER : dateTimeFormatter.format(date)
}
