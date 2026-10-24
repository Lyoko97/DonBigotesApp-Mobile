import type { Order, OrderActionResult, OrderStatus } from "../tipos";
import { mockOrdersService } from "./mockAdapter";
import { httpOrdersService } from "./httpAdapter";

// PROVISIONAL: misma interfaz `OrdersService` que propone Persona 1 en
// docs/PLAN-BASE-PROYECTO.md (sección f). Cuando exista src/services, las
// pantallas importan `services.orders` de ahí y se borra esta carpeta.
export interface OrdersService {
  listOrders(params?: { status?: OrderStatus; date?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderActionResult>;
}

// Mismo selector que el plan base: EXPO_PUBLIC_API_ADAPTER = "http" | "mock".
// Por defecto "mock", porque la API real aún no acepta el token del móvil.
export const ordersService: OrdersService =
  process.env.EXPO_PUBLIC_API_ADAPTER === "http" ? httpOrdersService : mockOrdersService;

export function mensajeDeError(error: unknown, alternativo: string): string {
  return error instanceof Error && error.message ? error.message : alternativo;
}
