export interface PaginatedResponse<TItem> {
  data: TItem[]
  total: number
  page: number
  per_page: number
}
