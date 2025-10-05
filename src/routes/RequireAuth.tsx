import { Navigate } from "react-router-dom";

import { getToken } from '../services/authService';
import type { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Vérifier le flag doitChangerMotDePasse dans le localStorage (si stocké)
  const userStr = localStorage.getItem('user');
  let doitChangerMotDePasse = false;
  let role = '';
  if (userStr) {
    const user = JSON.parse(userStr);
    doitChangerMotDePasse = user.doitChangerMotDePasse;
    role = user.role;
  }
  // On ne force la redirection que si ce n'est PAS un caissier
  if (doitChangerMotDePasse && role !== 'CAISSIER') {
    return <Navigate to="/changer-mot-de-passe" replace />;
  }
  return <>{children}</>;
}
