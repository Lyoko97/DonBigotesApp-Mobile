import type { Order } from "../tipos";
import type { OrdersService } from "./ordersService";

// PROVISIONAL: adaptador http mínimo con `fetch` (axios aún no está instalado).
// Persona 1 lo reemplaza por el de src/services/http, que usará axios y el
// token de la sesión. Solo se usa con EXPO_PUBLIC_API_ADAPTER=http.
//
// Requiere que la web acepte "Authorization: Bearer <token>" (cambio en curso
// en el repo web, CLAUDE.md §7). Sin eso, la API responde 401.

let obtenerToken: () => string | null = () => null;

// La sesión (Persona 1) registra aquí cómo obtener el token.
export function configurarTokenPedidos(fn: () => string | null): void {
  obtenerToken = fn;
}

const ERROR_RED = "No se pudo conectar con el servidor. Revisa tu conexión.";

async function pedir<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.EXPO_PUBLIC_API_URL;
  if (!base) throw new Error("Falta configurar EXPO_PUBLIC_API_URL.");
  const token = obtenerToken();

  let respuesta: Response;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error(ERROR_RED);
  }

  const datos = (await respuesta.json().catch(() => null)) as { error?: unknown } | null;
  if (!respuesta.ok) {
    const mensaje = typeof datos?.error === "string" ? datos.error : `Error del servidor (${respuesta.status}).`;
    throw new Error(mensaje);
  }
  return datos as T;
}

export const httpOrdersService: OrdersService = {
  async listOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.date) query.set("date", params.date);
    const qs = query.toString();
    const { orders } = await pedir<{ orders: Order[] }>(`/api/orders${qs ? `?${qs}` : ""}`);
    return orders;
  },

  // La web no tiene GET /api/orders/[id]: se pide la lista y se busca.
  async getOrder(id) {
    const { orders } = await pedir<{ orders: Order[] }>("/api/orders");
    const pedido = orders.find((p) => p.id === id);
    if (!pedido) throw new Error("El pedido no existe o ya fue eliminado.");
    return pedido;
  },

  async updateStatus(id, status) {
    try {
      await pedir(`/api/orders/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : ERROR_RED };
    }
  },
};
