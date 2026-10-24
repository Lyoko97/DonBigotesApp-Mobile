// Adaptado de reference/types/auth.ts (alcance web). Se omite
// AuthContextValue: ese tipo pertenece a src/context/AuthContext.tsx, que es
// parte de la Capa 2 (en pausa — ver docs/DECISIONES.md).

export type Role = 'admin' | 'encargado';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  role: Role;
}

export type PublicUser = Omit<User, 'password'>;

export interface AuthResult {
  success: boolean;
  error?: string;
}
