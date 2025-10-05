import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../api/apiFetch';
import { on } from '../utils/eventBus';

export function useDashboardStats() {
  const { user, loading: authLoading } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    actifs: 0,
    masseSalariale: 0,
    montantPaye: 0,
    montantRestant: 0,
  });

  useEffect(() => {
    let unsub: (() => void) | null = null;
    const fetchStats = async () => {
      if (!entrepriseId || !user || authLoading) return;
      setLoading(true);
      setError(null);
      try {
        const currentStats = await apiFetch(`/paiement/stats/entreprise/${entrepriseId}/mois-courant`);
        setStats(currentStats);
      } catch (err) {
        console.error('Erreur lors du chargement des stats:', err);
        setError('Erreur lors du chargement des stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // subscribe to paiement events to refresh
    unsub = on('paiement:created', (payload: unknown) => {
      // Optimistically update numbers for snappier UI
      try {
  const montant = typeof payload === 'object' && payload !== null && 'montant' in (payload as object) ? Number((payload as unknown as { montant?: number }).montant) : undefined;
        if (montant && montant > 0) {
          setStats((s) => ({ ...s, montantPaye: s.montantPaye + montant, montantRestant: Math.max(0, s.montantRestant - montant) }));
        }
      } catch {
        // ignore
      }
      // and refetch to be safe
      fetchStats();
    });

    return () => {
      if (unsub) unsub();
    };
  }, [entrepriseId, user, authLoading]);

  return { ...stats, loading, error };
}
