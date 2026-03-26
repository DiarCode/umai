export interface Restaurant {
  id: string
  code: string
  name: string
  logo?: string
  status: 'open' | 'closed'
  description?: string
}
