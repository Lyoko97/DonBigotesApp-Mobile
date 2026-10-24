import type { Services } from './types';
import { env } from '../lib/env';
import { mockAuthService } from './mock/authService';
import { mockOrdersService } from './mock/ordersService';
import { httpAuthService } from './http/authService';
import { httpOrdersService } from './http/ordersService';

// Único punto donde se decide http vs mock (EXPO_PUBLIC_API_ADAPTER, ver
// src/lib/env.ts y .env.example). Las pantallas siempre importan `services`
// de aquí, nunca los adaptadores directamente.
export const services: Services =
  env.apiAdapter === 'http'
    ? { auth: httpAuthService, orders: httpOrdersService }
    : { auth: mockAuthService, orders: mockOrdersService };

export type { Services, AuthService, OrdersService, ListOrdersParams } from './types';
