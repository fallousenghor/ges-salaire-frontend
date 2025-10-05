import { clearAuth } from '../services/authService';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const { logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    // D'abord nettoyer le localStorage
    clearAuth();
    
    // Ensuite appeler le logout du contexte
    contextLogout();
    
    // Rediriger vers la page de login
    navigate('/login', { replace: true });
  };
  
  return { logout };
}
