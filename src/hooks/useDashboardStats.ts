import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../api/apiFetch';
import { on } from '../utils/eventBus';

// État initial des statistiques
const initialStats = {
  actifs: 0,
  masseSalariale: 0,
  montantPaye: 0,
  montantRestant: 0,
};

export function useDashboardStats() {
  const { user, loading: authLoading } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState(initialStats);

  // Fonction pour réinitialiser les stats
  const resetStats = useCallback(() => {
    setStats(initialStats);
    setError(null);
    setLoading(false);
  }, []);

  // Fonction pour charger les stats
  const fetchStats = useCallback(async () => {
    if (!entrepriseId || !user || authLoading) {
      resetStats();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentStats = await apiFetch(`/paiement/stats/entreprise/${entrepriseId}/mois-courant`);
      setStats(currentStats);
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
      setError('Erreur lors du chargement des stats');
      setStats(initialStats);
    } finally {
      setLoading(false);
    }
  }, [entrepriseId, user, authLoading, resetStats]);

  // Effet pour gérer la déconnexion
  useEffect(() => {
    const handleLogout = () => {
      resetStats();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [resetStats]);

  // Effet pour gérer le chargement initial et les mises à jour
  useEffect(() => {
    let unsub: (() => void) | null = null;

    // Charger les stats initiales
    fetchStats();
    
    // Configurer les écouteurs d'événements pour les mises à jour
    const events = ['paiement:created', 'paiement:updated', 'employe:created', 'employe:updated'];
    const unsubscribers = events.map(event => 
      on(event, () => {
        fetchStats();
      })
    );
    
    unsub = () => {
      unsubscribers.forEach(unsub => unsub());
    };

    return () => {
      if (unsub) unsub();
    };
  }, [fetchStats]);

  // Réinitialiser quand il n'y a pas d'utilisateur
  useEffect(() => {
    if (!user) {
      resetStats();
    }
  }, [user, resetStats]);

  return { ...stats, loading, error };
}
