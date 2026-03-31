export const TAX_RATE = 0.1;
export const SERVICE_FEE_RATE = 0.05;
export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  OrderStatus[]
> = {
  [OrderStatus.PLACED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY],
  [OrderStatus.READY]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};