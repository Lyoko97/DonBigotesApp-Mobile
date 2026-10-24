// Datos semilla del adaptador mock. Credenciales y pedidos de PRUEBA — nunca
// contraseñas reales (CLAUDE.md §9.7); documentadas también en README.
//
// Los precios por platillo no se inventaron: se derivaron resolviendo el
// sistema de ecuaciones que forman los totales de los 9 pedidos ya
// aprobados en design/C2-pedidos.html (considerando el cargo de +$1.00 a
// domicilio, CLAUDE.md §8). Todos caen dentro de $2.50–$3.50 (CLAUDE.md §8).
// El pedido #227 (cancelado) no está en el mockup: se agregó para poder
// probar que un pedido cancelado no aparece en la lista pero sí en su
// detalle (punto i.2 / aprobación checkpoint 3).

import type { User } from '../../types/auth';
import type { Order } from '../../types/order';
import { getTodayKey } from '../../lib/format';

export const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    nombre: 'Administrador',
    email: 'admin@donbigotes.test',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'user-encargado',
    nombre: 'Encargado',
    email: 'encargado@donbigotes.test',
    password: 'encargado123',
    role: 'encargado',
  },
];

const PRICES = {
  sopaDeRes: 3.25,
  pechuga: 3.0,
  polloEmpanizado: 3.0,
  lasanaDePollo: 2.75,
  chilaquilasDePollo: 3.0,
  lomitoResCremaHongos: 3.25,
  carneResPlancha: 3.0,
  lomitoCerdoJalapena: 3.25,
  lomoCerdoAsado: 3.0,
} as const;

const todayKey = getTodayKey();

// "HH:MM" (24h, hora de El Salvador) -> ISO 8601 de hoy a esa hora.
function todayAt(hhmm: string): string {
  return new Date(`${todayKey}T${hhmm}:00-06:00`).toISOString();
}

const STAFF_ADMIN = { id: 'user-admin', nombre: 'Administrador' };
const STAFF_ENCARGADO = { id: 'user-encargado', nombre: 'Encargado' };

export const SEED_ORDERS: Order[] = [
  {
    id: 'order-227',
    number: 227,
    customerName: 'Walter',
    deliveryType: 'local',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'sopa-de-res', dishName: 'Sopa de res', unitPrice: PRICES.sopaDeRes, quantity: 1, subtotal: PRICES.sopaDeRes },
    ],
    total: PRICES.sopaDeRes,
    status: 'cancelado',
    createdAt: todayAt('10:50'),
    updatedAt: todayAt('10:55'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-228',
    number: 228,
    customerName: 'Yesenia',
    deliveryType: 'local',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'sopa-de-res', dishName: 'Sopa de res', unitPrice: PRICES.sopaDeRes, quantity: 1, subtotal: PRICES.sopaDeRes },
      { dishId: 'pechuga', dishName: 'Pechuga', unitPrice: PRICES.pechuga, quantity: 1, subtotal: PRICES.pechuga },
    ],
    total: 6.25,
    status: 'entregado',
    createdAt: todayAt('11:12'),
    updatedAt: todayAt('11:12'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-229',
    number: 229,
    customerName: 'Carlos',
    deliveryType: 'para_llevar',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'pollo-empanizado', dishName: 'Pollo empanizado', unitPrice: PRICES.polloEmpanizado, quantity: 2, subtotal: 6.0 },
    ],
    total: 6.0,
    status: 'entregado',
    createdAt: todayAt('11:20'),
    updatedAt: todayAt('11:20'),
    createdBy: STAFF_ADMIN,
  },
  {
    id: 'order-230',
    number: 230,
    customerName: 'Fernando',
    customerPhone: '7205-1234',
    deliveryType: 'domicilio',
    deliveryAddress: 'Pasaje 4, Casa #12, Col. Las Brisas, Soyapango',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'lasana-de-pollo', dishName: 'Lasaña de pollo', unitPrice: PRICES.lasanaDePollo, quantity: 1, subtotal: PRICES.lasanaDePollo },
      { dishId: 'chilaquilas-de-pollo', dishName: 'Chilaquilas de pollo', unitPrice: PRICES.chilaquilasDePollo, quantity: 1, subtotal: PRICES.chilaquilasDePollo },
    ],
    total: 6.75,
    status: 'listo',
    createdAt: todayAt('11:45'),
    updatedAt: todayAt('11:45'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-231',
    number: 231,
    customerName: 'Daysi',
    deliveryType: 'local',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'lomito-res-crema-hongos', dishName: 'Lomito de res en crema de hongos', unitPrice: PRICES.lomitoResCremaHongos, quantity: 1, subtotal: PRICES.lomitoResCremaHongos },
    ],
    total: PRICES.lomitoResCremaHongos,
    status: 'en_preparacion',
    createdAt: todayAt('12:05'),
    updatedAt: todayAt('12:05'),
    createdBy: STAFF_ADMIN,
  },
  {
    id: 'order-232',
    number: 232,
    customerName: 'Mauricio',
    deliveryType: 'para_llevar',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'carne-res-plancha', dishName: 'Carne de res a la plancha', unitPrice: PRICES.carneResPlancha, quantity: 1, subtotal: PRICES.carneResPlancha },
      { dishId: 'pollo-empanizado', dishName: 'Pollo empanizado', unitPrice: PRICES.polloEmpanizado, quantity: 1, subtotal: PRICES.polloEmpanizado },
    ],
    total: 6.0,
    status: 'en_preparacion',
    createdAt: todayAt('12:18'),
    updatedAt: todayAt('12:18'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-233',
    number: 233,
    customerName: 'Patricia',
    customerPhone: '7308-5566',
    deliveryType: 'domicilio',
    deliveryAddress: 'Calle Principal, Casa #45, Col. Las Brisas, Soyapango',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'lomito-cerdo-jalapena', dishName: 'Lomito de cerdo en punta jalapeña', unitPrice: PRICES.lomitoCerdoJalapena, quantity: 1, subtotal: PRICES.lomitoCerdoJalapena },
    ],
    total: 4.25,
    status: 'pendiente',
    createdAt: todayAt('12:40'),
    updatedAt: todayAt('12:40'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-234',
    number: 234,
    customerName: 'Oscar',
    deliveryType: 'local',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'lomo-cerdo-asado', dishName: 'Lomo de cerdo asado', unitPrice: PRICES.lomoCerdoAsado, quantity: 2, subtotal: 6.0 },
    ],
    total: 6.0,
    status: 'pendiente',
    createdAt: todayAt('17:15'),
    updatedAt: todayAt('17:15'),
    createdBy: STAFF_ADMIN,
  },
  {
    id: 'order-235',
    number: 235,
    customerName: 'Rosa',
    deliveryType: 'para_llevar',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'sopa-de-res', dishName: 'Sopa de res', unitPrice: PRICES.sopaDeRes, quantity: 1, subtotal: PRICES.sopaDeRes },
      { dishId: 'lasana-de-pollo', dishName: 'Lasaña de pollo', unitPrice: PRICES.lasanaDePollo, quantity: 1, subtotal: PRICES.lasanaDePollo },
    ],
    total: 6.0,
    status: 'pendiente',
    createdAt: todayAt('17:30'),
    updatedAt: todayAt('17:30'),
    createdBy: STAFF_ENCARGADO,
  },
  {
    id: 'order-236',
    number: 236,
    customerName: 'Vilma',
    customerPhone: '7612-9987',
    deliveryType: 'domicilio',
    deliveryAddress: 'Pasaje 7, Casa #3, Col. Las Brisas, Soyapango',
    paymentMethod: 'efectivo',
    items: [
      { dishId: 'pechuga', dishName: 'Pechuga', unitPrice: PRICES.pechuga, quantity: 1, subtotal: PRICES.pechuga },
      { dishId: 'chilaquilas-de-pollo', dishName: 'Chilaquilas de pollo', unitPrice: PRICES.chilaquilasDePollo, quantity: 1, subtotal: PRICES.chilaquilasDePollo },
    ],
    total: 7.0,
    status: 'en_preparacion',
    createdAt: todayAt('17:50'),
    updatedAt: todayAt('17:50'),
    createdBy: STAFF_ADMIN,
  },
];
