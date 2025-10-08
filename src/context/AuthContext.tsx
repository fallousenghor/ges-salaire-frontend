import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextOnly";
import type { Role, User } from "./AuthContextOnly";
import { login as loginApi } from "../api/loginApi";


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Commence à true pour le chargement initial

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Déconnexion complète avant la nouvelle connexion
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      
      // Attendre que le state soit réinitialisé
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const data = await loginApi(email, password);
      // Extraction de entrepriseId depuis le tableau de rôles si présent
      let entrepriseId;
      if (Array.isArray(data.user.roles)) {
  const role = data.user.roles.find((r: Role) => r.role === "ADMIN" || r.role === "CAISSIER");
        if (role && role.entrepriseId) {
          entrepriseId = role.entrepriseId;
        }
      }
      const userWithEntreprise = { ...data.user, entrepriseId };
      setToken(data.token);
      setUser(userWithEntreprise);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userWithEntreprise));
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  };

 
  const logout = () => {
    // Indiquer que nous sommes en train de déconnecter
    setLoading(true);

    // Publier l'événement de déconnexion avant de nettoyer le state
    window.dispatchEvent(new CustomEvent('auth:logout'));

    // Nettoyer immédiatement le localStorage
    localStorage.clear();  // Nettoie tout le localStorage

    // Réinitialiser le state de manière synchrone
    setUser(null);
    setToken(null);

    // Forcer un petit délai pour permettre aux composants de se mettre à jour
    requestAnimationFrame(() => {
      setLoading(false);
    });
  };

  const reload = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, reload }}>
      {children}
    </AuthContext.Provider>
  );
};

