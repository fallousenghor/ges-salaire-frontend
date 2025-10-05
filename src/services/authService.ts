
  import type { Role } from "../context/AuthContextOnly";
export type UserWithFlag = {
  email: string;
  id: string;
  role: string;
  doitChangerMotDePasse?: boolean;
  entrepriseId?: number;
  roles?: Role[];
};

export function setAuth(token: string, user: UserWithFlag) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUser(): UserWithFlag | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
