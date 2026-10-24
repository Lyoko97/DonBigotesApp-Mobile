import type { AuthService } from '../types';

// Solo estructura por ahora: la web todavía no expone POST /api/auth/login
// con token (CLAUDE.md §7 — "está en curso"). No se inventa el endpoint;
// cuando exista, esto se completa con httpClient y se deja de usar el mock
// para auth. Mientras tanto, services/index.ts nunca selecciona este
// adaptador salvo que se fuerce EXPO_PUBLIC_API_ADAPTER=http a propósito.
export const httpAuthService: AuthService = {
  async login() {
    throw new Error(
      'Auth por HTTP todavía no implementado: el backend web no expone login con token (CLAUDE.md §7). Usa el adaptador mock.'
    );
  },

  async register() {
    throw new Error(
      'Auth por HTTP todavía no implementado: el backend web no expone registro con token (CLAUDE.md §7). Usa el adaptador mock.'
    );
  },
};
