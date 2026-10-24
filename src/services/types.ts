// Contrato único de la capa de servicios (solo el líder lo modifica —
// CLAUDE.md §3). Las pantallas solo deben importar `services` desde
// src/services/index.ts, nunca axios ni los adaptadores directamente.
//
// Sin StatsService: Estadísticas se calcula en el cliente a partir de
// OrdersService.listOrders() con funciones puras en src/lib/stats.ts
// (Persona 2).

import type { Role, PublicUser, AuthResult } from '../types/auth';
import type { Order, OrderStatus, OrderActionResult } from '../types/order';

export interface AuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(nombre: string, email: string, password: string, role: Role): Promise<AuthResult>;
}

export interface ListOrdersParams {
  status?: OrderStatus;
  date?: string; // "YYYY-MM-DD", día del negocio (ver src/lib/format.ts)
}

export interface OrdersService {
  listOrders(params?: ListOrdersParams): Promise<Order[]>;
  getOrder(id: string): Promise<Order>;
  // El móvil solo avanza el estado (nunca cancela ni crea pedidos — ver
  // src/services/mock/ordersService.ts). La pantalla de Pedidos (Persona 3)
  // es la responsable de no ofrecer la acción de cancelar; el servicio en sí
  // no la bloquea porque refleja la misma API que usa la web.
  updateStatus(id: string, status: OrderStatus): Promise<OrderActionResult>;
}

export interface Services {
  auth: AuthService;
  orders: OrdersService;
}

// Tipo auxiliar reexportado para quien solo necesite el usuario público sin
// importar directamente de src/types/auth.
export type { PublicUser };
