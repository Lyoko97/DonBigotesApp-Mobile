import type { OrderStatus } from '../types/order';

// --- Portado de reference/orderStatus.ts (alcance web) ----------------------
// Misma lógica de transición que usa la web, para que el móvil valide igual.

export const ORDER_STATUSES: OrderStatus[] = [
  'pendiente',
  'en_preparacion',
  'listo',
  'entregado',
  'cancelado',
];

// Texto del botón que lleva un pedido a este estado (web). El móvil usa su
// propia versión más corta — ver MOBILE_ORDER_STATUS_ACTION_LABELS abajo.
export const ORDER_STATUS_ACTION_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Volver a pendiente',
  en_preparacion: 'Pasar a preparación',
  listo: 'Marcar como listo',
  entregado: 'Marcar entregado',
  cancelado: 'Cancelar pedido',
};

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ['en_preparacion', 'cancelado'],
  en_preparacion: ['listo', 'cancelado'],
  listo: ['entregado', 'cancelado'],
  entregado: [],
  cancelado: [],
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as string[]).includes(value);
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

// Siguiente paso "normal" del flujo (sin contar la cancelación). El móvil
// solo ofrece avanzar por esta vía — nunca cancelar (ver nota en
// src/services/mock/ordersService.ts).
export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return TRANSITIONS[status].find((next) => next !== 'cancelado') ?? null;
}

export function isInProgress(status: OrderStatus): boolean {
  return status === 'pendiente' || status === 'en_preparacion' || status === 'listo';
}

// --- Mapeo al vocabulario del mockup móvil (aprobado — punto i.2 del plan) --
// La web tiene 5 estados; el mockup C2 solo tiene 4 chips de filtro, sin
// "Cancelado". El mapeo es 1:1 para los 4 activos; "cancelado" no tiene chip
// propio (un pedido cancelado no aparece en la lista — ver
// VISIBLE_ORDER_STATUSES) pero sí se muestra con un tag gris si se accede
// directo a su detalle.

export type MobileOrderStatus = 'recibido' | 'preparacion' | 'listo' | 'entregado' | 'cancelado';

const STATUS_TO_MOBILE: Record<OrderStatus, MobileOrderStatus> = {
  pendiente: 'recibido',
  en_preparacion: 'preparacion',
  listo: 'listo',
  entregado: 'entregado',
  cancelado: 'cancelado',
};

export function toMobileStatus(status: OrderStatus): MobileOrderStatus {
  return STATUS_TO_MOBILE[status];
}

export const MOBILE_ORDER_STATUS_LABELS: Record<MobileOrderStatus, string> = {
  recibido: 'Recibido',
  preparacion: 'En preparación',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

// Chips de filtro de C2 — en el mismo orden del mockup.
export const VISIBLE_ORDER_STATUSES: MobileOrderStatus[] = [
  'recibido',
  'preparacion',
  'listo',
  'entregado',
];
