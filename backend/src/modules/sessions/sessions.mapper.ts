import { QrResponse } from './sessions.types';

type TableWithRestaurant = {
  id: string;
  label: string;
  restaurant: {
    id: string;
    name: string;
  };
};

export function mapToQrResponse(
  table: TableWithRestaurant,
  guestToken: string,
): QrResponse {
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
  };
}
