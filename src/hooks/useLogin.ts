import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/loginApi';
import { setAuth } from '../services/authService';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, motDePasse: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!email || !motDePasse) {
        throw new Error("L'email et le mot de passe sont requis");
      }
      const data = await loginApi(email, motDePasse);
      
      if (!data || !data.token) {
        throw new Error("Le serveur n'a pas renvoyé de token");
      }
      
      const payload = parseJwt(data.token);
      if (!payload || !payload.userId || !payload.email || !payload.role) {
        throw new Error("Le token reçu est invalide");
      }

      // Sauvegarder les données d'authentification
      setAuth(data.token, {
        email: payload.email,
        id: payload.userId,
        role: payload.role,
        doitChangerMotDePasse: data.doitChangerMotDePasse === true,
        entrepriseId: data.user?.entrepriseId,
        roles: data.user?.roles
      });

      // Détermine la route en fonction du rôle
      const targetRoute = payload.role.toUpperCase() === 'CAISSIER' ? '/paiements' : '/dashboard';
      
      // Rediriger vers la route appropriée
      navigate(targetRoute, { replace: true });
      
      // Forcer le rafraîchissement après la redirection
      setTimeout(() => {
        window.location.reload();
      }, 100);

      return {
        doitChangerMotDePasse: data.doitChangerMotDePasse === true,
        token: data.token
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { login, loading, error };
}
