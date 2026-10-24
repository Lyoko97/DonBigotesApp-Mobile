import type { OrdersService } from '../types';

// Solo estructura en este checkpoint (a diferencia de auth, estos endpoints
// sí existen y están documentados en CLAUDE.md §7: GET/POST /api/orders,
// PATCH/DELETE /api/orders/[id]). Cuando se conecte de verdad, este archivo
// importa httpClient desde ./client y hace las llamadas — avisa si quieres
// que se haga ya, es un cambio pequeño.
export const httpOrdersService: OrdersService = {
  async listOrders() {
    throw new Error('OrdersService por HTTP: pendiente de conectar (ver comentario en este archivo).');
  },

  async getOrder() {
    throw new Error('OrdersService por HTTP: pendiente de conectar (ver comentario en este archivo).');
  },

  async updateStatus() {
    throw new Error('OrdersService por HTTP: pendiente de conectar (ver comentario en este archivo).');
  },
};
