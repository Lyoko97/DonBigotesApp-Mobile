import type { DeliveryType, Order, OrderItem, OrderStatus, PaymentMethod } from "../tipos";
import type { OrdersService } from "./ordersService";
import { canTransition, ETIQUETA_ESTADO } from "../estados";
import { claveDelDia, redondear } from "../formato";

// Datos de prueba del comedor. Platillos y precios tomados de
// design/C2-pedidos.html (todos entre $2.50 y $3.50, CLAUDE.md §8). Las
// horas se calculan a partir de "ahora", nunca son fechas fijas.

const PLATILLOS = {
  sopaRes: { id: "sopa-res", nombre: "Sopa de res", precio: 3.25 },
  pechuga: { id: "pechuga", nombre: "Pechuga", precio: 3.0 },
  polloEmpanizado: { id: "pollo-empanizado", nombre: "Pollo empanizado", precio: 3.0 },
  lasana: { id: "lasana-pollo", nombre: "Lasaña de pollo", precio: 2.75 },
  chilaquilas: { id: "chilaquilas-pollo", nombre: "Chilaquilas de pollo", precio: 3.0 },
  lomitoRes: { id: "lomito-res-hongos", nombre: "Lomito de res en crema de hongos", precio: 3.25 },
  carneRes: { id: "carne-res-plancha", nombre: "Carne de res a la plancha", precio: 3.0 },
  lomitoCerdo: { id: "lomito-cerdo-jalapena", nombre: "Lomito de cerdo en punta jalapeña", precio: 3.25 },
  lomoCerdo: { id: "lomo-cerdo-asado", nombre: "Lomo de cerdo asado", precio: 3.0 },
};
type Platillo = (typeof PLATILLOS)[keyof typeof PLATILLOS];

const CARGO_DOMICILIO = 1.0; // CLAUDE.md §8

// Si es true, cada 45 s llega un pedido nuevo "Recibido" (máximo 3) para que
// en el video se vea que el sondeo trae pedidos sin recargar la pantalla.
const SIMULAR_PEDIDOS_NUEVOS = true;
const INTERVALO_SIMULACION_MS = 45_000;
const MAX_SIMULADOS = 3;

const ENCARGADO = { id: "2", nombre: "Encargado de turno" };

interface Semilla {
  numero: number;
  minutosAtras: number;
  estado: OrderStatus;
  modalidad: DeliveryType;
  pago: PaymentMethod;
  cliente: string;
  telefono?: string;
  direccion?: string;
  nota?: string;
  platillos: [Platillo, number][];
}

// Mismos pedidos y estados que el prototipo C2 (#228–#236).
const SEMILLAS: Semilla[] = [
  { numero: 228, minutosAtras: 205, estado: "entregado", modalidad: "local", pago: "efectivo", cliente: "Mesa 2", platillos: [[PLATILLOS.sopaRes, 1], [PLATILLOS.pechuga, 1]] },
  { numero: 229, minutosAtras: 197, estado: "entregado", modalidad: "para_llevar", pago: "tarjeta", cliente: "Marta López", telefono: "7012-4455", platillos: [[PLATILLOS.polloEmpanizado, 2]] },
  { numero: 230, minutosAtras: 172, estado: "listo", modalidad: "domicilio", pago: "efectivo", cliente: "José Ramírez", telefono: "7788-1020", direccion: "Col. Las Brisas, pasaje 3, casa 14", platillos: [[PLATILLOS.lasana, 1], [PLATILLOS.chilaquilas, 1]] },
  { numero: 231, minutosAtras: 152, estado: "en_preparacion", modalidad: "local", pago: "efectivo", cliente: "Mesa 5", platillos: [[PLATILLOS.lomitoRes, 1]] },
  { numero: 232, minutosAtras: 139, estado: "en_preparacion", modalidad: "para_llevar", pago: "efectivo", cliente: "Karla Hernández", telefono: "6123-9087", nota: "Sin cebolla", platillos: [[PLATILLOS.carneRes, 1], [PLATILLOS.polloEmpanizado, 1]] },
  { numero: 233, minutosAtras: 117, estado: "pendiente", modalidad: "domicilio", pago: "efectivo", cliente: "Ana Martínez", telefono: "7456-3321", direccion: "Col. Las Brisas, calle principal, casa 7", platillos: [[PLATILLOS.lomitoCerdo, 1]] },
  { numero: 234, minutosAtras: 42, estado: "pendiente", modalidad: "local", pago: "tarjeta", cliente: "Mesa 1", platillos: [[PLATILLOS.lomoCerdo, 2]] },
  { numero: 235, minutosAtras: 27, estado: "pendiente", modalidad: "para_llevar", pago: "efectivo", cliente: "Carlos Pérez", telefono: "7234-5678", platillos: [[PLATILLOS.sopaRes, 1], [PLATILLOS.lasana, 1]] },
  { numero: 236, minutosAtras: 7, estado: "en_preparacion", modalidad: "domicilio", pago: "efectivo", cliente: "Rosa Guevara", telefono: "7901-2233", direccion: "Col. Las Brisas, pasaje 8, casa 2", platillos: [[PLATILLOS.pechuga, 1], [PLATILLOS.chilaquilas, 1]] },
];

function crearPedido(s: Semilla, creado: Date): Order {
  const items: OrderItem[] = s.platillos.map(([p, cantidad]) => ({
    dishId: p.id,
    dishName: p.nombre,
    unitPrice: p.precio,
    quantity: cantidad,
    subtotal: redondear(p.precio * cantidad),
  }));
  const platillos = items.reduce((acc, item) => acc + item.subtotal, 0);
  const iso = creado.toISOString();
  return {
    id: `mock-${s.numero}`,
    number: s.numero,
    customerName: s.cliente,
    customerPhone: s.telefono,
    deliveryType: s.modalidad,
    deliveryAddress: s.direccion,
    paymentMethod: s.pago,
    notes: s.nota,
    items,
    total: redondear(platillos + (s.modalidad === "domicilio" ? CARGO_DOMICILIO : 0)),
    status: s.estado,
    createdAt: iso,
    updatedAt: iso,
    createdBy: ENCARGADO,
  };
}

const inicio = Date.now();
let pedidos: Order[] = SEMILLAS.map((s) => crearPedido(s, new Date(inicio - s.minutosAtras * 60_000)));
let simulados = 0;

// Pedidos que "llegan" mientras la app está abierta (ver SIMULAR_PEDIDOS_NUEVOS).
const LLEGADAS: Omit<Semilla, "numero" | "minutosAtras" | "estado">[] = [
  { modalidad: "para_llevar", pago: "efectivo", cliente: "Luis Flores", telefono: "7345-1188", platillos: [[PLATILLOS.polloEmpanizado, 1], [PLATILLOS.sopaRes, 1]] },
  { modalidad: "local", pago: "efectivo", cliente: "Mesa 4", platillos: [[PLATILLOS.carneRes, 2]] },
  { modalidad: "domicilio", pago: "efectivo", cliente: "Sofía Castillo", telefono: "7620-4410", direccion: "Col. Las Brisas, pasaje 1, casa 20", platillos: [[PLATILLOS.lasana, 2]] },
];

function simularLlegadas() {
  if (!SIMULAR_PEDIDOS_NUEVOS) return;
  const debidos = Math.min(MAX_SIMULADOS, Math.floor((Date.now() - inicio) / INTERVALO_SIMULACION_MS));
  while (simulados < debidos) {
    const llegada = LLEGADAS[simulados];
    const numero = Math.max(...pedidos.map((p) => p.number)) + 1;
    pedidos = [...pedidos, crearPedido({ ...llegada, numero, minutosAtras: 0, estado: "pendiente" }, new Date())];
    simulados++;
  }
}

// Simula la latencia de la red para que se vean los estados de carga.
const esperar = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockOrdersService: OrdersService = {
  async listOrders(params = {}) {
    await esperar();
    simularLlegadas();
    const hoy = claveDelDia(new Date());
    return pedidos
      .filter((p) => !params.status || p.status === params.status)
      .filter((p) => !params.date || claveDelDia(p.createdAt) === (params.date === "today" ? hoy : params.date))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // igual que la API: recientes primero
  },

  async getOrder(id) {
    await esperar(200);
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error("El pedido no existe o ya fue eliminado.");
    return pedido;
  },

  // Mismas reglas que PATCH /api/orders/[id] de la web.
  async updateStatus(id, status) {
    await esperar();
    const actual = pedidos.find((p) => p.id === id);
    if (!actual) return { success: false, error: "El pedido no existe o ya fue eliminado." };
    if (!canTransition(actual.status, status)) {
      return {
        success: false,
        error: `No se puede pasar un pedido de "${ETIQUETA_ESTADO[actual.status]}" a "${ETIQUETA_ESTADO[status]}".`,
      };
    }
    const actualizado: Order = { ...actual, status, updatedAt: new Date().toISOString() };
    pedidos = pedidos.map((p) => (p.id === id ? actualizado : p));
    return { success: true };
  },
};
