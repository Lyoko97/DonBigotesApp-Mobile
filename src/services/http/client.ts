import axios from 'axios';
import { env } from '../../lib/env';

// Nunca se escribe la URL en el código (CLAUDE.md §7): sale de
// EXPO_PUBLIC_API_URL (ver .env.example, checkpoint 6).
export const httpClient = axios.create({
  baseURL: env.apiUrl,
});

// TODO: cuando exista auth real por token (CLAUDE.md §7), agregar aquí un
// interceptor que ponga `Authorization: Bearer <token>` desde expo-secure-store.
