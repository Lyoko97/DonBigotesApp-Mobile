// Adaptado de reference/types/order.ts (alcance web). El módulo de Pedidos
// en el móvil es de solo lectura con cambio de estado (sin creación ni
// cancelación desde la app — aprobado en el plan de la Capa 1), así que se
// omiten a propósito: CreateOrderInput, CreateOrderItemInput, OrderField,
// OrderFieldErrors y OrdersContextValue. Si en el futuro el móvil necesita
// crear pedidos, se vuelven a traer desde reference/types/order.ts.

export type OrderStatus =
  | 'pendiente'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado';

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

// "local": se consume en el comedor; "para_llevar": el cliente lo recoge;
// "domicilio": se entrega en la dirección del cliente (+$1.00, CLAUDE.md §8).
export type DeliveryType = 'local' | 'para_llevar' | 'domicilio';

export type PaymentMethod = 'efectivo' | 'tarjeta';

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
  createdAt: string;
  updatedAt: string;
  createdBy: OrderAuthor;
}

export interface OrderActionResult {
  success: boolean;
  error?: string;
}
