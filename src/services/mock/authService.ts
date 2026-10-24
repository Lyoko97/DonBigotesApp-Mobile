import type { AuthService } from '../types';
import type { Role } from '../../types/auth';
import { SEED_USERS } from './data';

// Los usuarios registrados desde la app no se comparten con la web ni
// persisten entre reinicios: viven solo en memoria (CLAUDE.md §7).
const users = [...SEED_USERS];

export const mockAuthService: AuthService = {
  async login(email, password) {
    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }
    return { success: true };
  },

  async register(nombre, email, password, role: Role) {
    if (users.some((u) => u.email === email)) {
      return { success: false, error: 'Ya existe un usuario con ese correo.' };
    }
    users.push({ id: `user-${users.length + 1}`, nombre, email, password, role });
    return { success: true };
  },
};
