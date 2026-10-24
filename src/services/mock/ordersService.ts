import type { ListOrdersParams, OrdersService } from '../types';
import { toBusinessDateKey } from '../../lib/format';
import { canTransition } from '../../lib/orderStatus';
import { SEED_ORDERS } from './data';

// En memoria: se reinicia cada vez que arranca la app (igual que el backend
// web en Vercel — CLAUDE.md §7).
const orders = SEED_ORDERS.map((order) => ({ ...order, items: [...order.items] }));

export const mockOrdersService: OrdersService = {
  async listOrders(params: ListOrdersParams = {}) {
    return orders.filter((order) => {
      // Sin filtro de estado explícito: los cancelados no aparecen en la
      // lista (aprobado en el plan — punto i.2). Si alguna vez se filtra
      // explícitamente por "cancelado", sí se devuelven.
      if (!params.status && order.status === 'cancelado') return false;
      if (params.status && order.status !== params.status) return false;
      if (params.date && toBusinessDateKey(order.createdAt) !== params.date) return false;
      return true;
    });
  },

  async getOrder(id) {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error(`Pedido "${id}" no encontrado.`);
    return order;
  },

  // El móvil solo ofrece avanzar el estado (nunca cancelar): esa regla vive
  // en la pantalla de Pedidos (Persona 3), que nunca debería llamar a esto
  // con status "cancelado". Aun así, el servicio valida la transición igual
  // que la web (canTransition) para que un bug de UI no deje datos
  // inconsistentes.
  async updateStatus(id, status) {
    const order = orders.find((o) => o.id === id);
    if (!order) return { success: false, error: `Pedido "${id}" no encontrado.` };
    if (!canTransition(order.status, status)) {
      return { success: false, error: `No se puede pasar de "${order.status}" a "${status}".` };
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return { success: true };
  },
};
