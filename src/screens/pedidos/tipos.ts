// Copia de reference/types/order.ts (solo lo que usa Pedidos). No se importa
// directo porque reference/ usa el alias "@/..." de la web, que este proyecto
// no tiene configurado. Si Persona 1 publica los tipos compartidos en
// src/services/types.ts, importar de ahí y borrar este archivo.

export type OrderStatus = "pendiente" | "en_preparacion" | "listo" | "entregado" | "cancelado";

export type DeliveryType = "local" | "para_llevar" | "domicilio";

export type PaymentMethod = "efectivo" | "tarjeta";

export interface OrderItem {
  dishId: string;
  dishName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAuthor {
  id: string;
  nombre: string;
}

export interface Order {
  id: string;
  number: number;
  customerName: string;
  customerPhone?: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  createdBy: OrderAuthor;
}

export interface OrderActionResult {
  success: boolean;
  error?: string;
}
