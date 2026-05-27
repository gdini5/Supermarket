import { OrderStatus } from '../models/order.model';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Pendente',
  confirmed:  'Confirmada',
  preparing:  'Em Preparação',
  delivering: 'Em Entrega',
  delivered:  'Entregue',
  cancelled:  'Cancelada',
};

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function canCancelOrder(order: { status: OrderStatus; confirmedAt: string }): boolean {
  if (order.status !== 'pending' && order.status !== 'confirmed') return false;
  const confirmedAt = new Date(order.confirmedAt).getTime();
  return (Date.now() - confirmedAt) < 5 * 60 * 1000;
}
