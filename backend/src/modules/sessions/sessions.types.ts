export interface QrResponse {
  guestToken: string;
  restaurant: {
    id: string;
    name: string;
  };
  table: {
    id: string;
    label: string;
  };
}
