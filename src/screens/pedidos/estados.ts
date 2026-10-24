import type { DeliveryType, OrderStatus, PaymentMethod } from "./tipos";

// Adaptado de reference/orderStatus.ts (copia de la web): los VALORES y las
// TRANSICIONES son los mismos que valida el servidor; las ETIQUETAS siguen el
// prototipo móvil C2. Mapeo propuesto por Persona 1 en
// docs/PLAN-BASE-PROYECTO.md (punto i.2), pendiente de aprobación.

// Variante visual del Tag (mismos nombres que la prop `status` del plan base).
export type TagStatus = "recibido" | "preparacion" | "listo" | "entregado" | "cancelado";

export const ESTADO_A_TAG: Record<OrderStatus, TagStatus> = {
  pendiente: "recibido",
  en_preparacion: "preparacion",
  listo: "listo",
  entregado: "entregado",
  cancelado: "cancelado",
};

export const ETIQUETA_ESTADO: Record<OrderStatus, string> = {
  pendiente: "Recibido",
  en_preparacion: "En preparación",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// Chips del prototipo C2, en orden. "cancelado" no tiene chip.
export const FILTROS_ESTADO: (OrderStatus | "todos")[] = [
  "todos",
  "pendiente",
  "en_preparacion",
  "listo",
  "entregado",
];

// Propuesta i.2: los cancelados no salen en la lista, solo en el detalle.
export const MOSTRAR_CANCELADOS_EN_LISTA = false;

// Texto del botón que lleva un pedido a ese estado (mismos textos que la web).
export const ACCION_ESTADO: Record<OrderStatus, string> = {
  pendiente: "Volver a recibido",
  en_preparacion: "Pasar a preparación",
  listo: "Marcar como listo",
  entregado: "Marcar entregado",
  cancelado: "Cancelar pedido",
};

const TRANSICIONES: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ["en_preparacion", "cancelado"],
  en_preparacion: ["listo", "cancelado"],
  listo: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSICIONES[from].includes(to);
}

// Siguiente paso normal del flujo (sin contar la cancelación).
export function getNextStatus(status: OrderStatus): OrderStatus | null {
  return TRANSICIONES[status].find((next) => next !== "cancelado") ?? null;
}

// Nombres del prototipo móvil (CLAUDE.md §8: Local · Retiro · Domicilio).
export const ETIQUETA_MODALIDAD: Record<DeliveryType, string> = {
  local: "Local",
  para_llevar: "Retiro",
  domicilio: "Domicilio",
};

export const ETIQUETA_PAGO: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
};
