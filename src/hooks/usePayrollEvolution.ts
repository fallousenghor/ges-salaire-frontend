import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchEmployes } from '../services/employeService';
import { apiFetch } from '../api/apiFetch';

export interface PayrollChartPoint {
  month: string;
  total: number;
}

export function usePayrollEvolution() {
  const { user, loading: authLoading } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [data, setData] = useState<PayrollChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entrepriseId || !user || authLoading) {
      // Réinitialiser les données d'évolution si pas d'utilisateur
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchEmployes(entrepriseId)
      .then(async (employes) => {
        // Récupérer tous les payslips de chaque employé
        const payslipsArrays = await Promise.all(
          employes.map((e) => apiFetch(`/payslip/employe/${e.id}`))
        );
        const payslips = payslipsArrays.flat();
        // Grouper par mois (6 derniers mois)
        const now = new Date();
        const months: PayrollChartPoint[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
          const total = payslips
            .filter(p => {
              const pd = new Date(p.createdAt);
              return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
            })
            .reduce((sum, p) => sum + (p.brut || 0), 0);
          months.push({ month: label, total });
        }
        setData(months);
      })
      .catch(() => setError('Erreur lors du chargement du graphique'))
      .finally(() => setLoading(false));
  }, [entrepriseId, user, authLoading]);

  return { data, loading, error };
}
