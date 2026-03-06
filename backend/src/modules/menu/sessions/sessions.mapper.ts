import { QrResponse } from './sessions.types'

export function mapToQrResponse(table: any, guestToken: string): QrResponse {
  return {
    guestToken,
    restaurant: {
      id: table.restaurant.id,
      name: table.restaurant.name,
    },
    table: {
      id: table.id,
      label: table.label,
    },
  }
}