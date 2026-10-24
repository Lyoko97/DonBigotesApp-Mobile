// Variables de entorno públicas de Expo (prefijo EXPO_PUBLIC_, documentadas
// en .env.example — checkpoint 6). Mientras no exista auth real por token en
// la web (CLAUDE.md §7), el valor por defecto es siempre "mock".

export type ApiAdapter = 'http' | 'mock';

function readApiAdapter(): ApiAdapter {
  return process.env.EXPO_PUBLIC_API_ADAPTER === 'http' ? 'http' : 'mock';
}

export const env = {
  apiAdapter: readApiAdapter(),
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
};
