import { clearAuth } from '../services/authService';

export function useLogout() {
  const logout = () => {
    clearAuth();
  };
  return { logout };
}
