import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchEmployes } from '../services/employeService';
import type { Employe } from '../types/employe';
import { apiFetch } from '../api/apiFetch';
import { on } from '../utils/eventBus';

export interface Payslip {
  id: number;
  employeId: number;
  createdAt: string;
  netAPayer: number;
  statut: string;
}

export interface Paiement {
  id: number;
  payslipId: number;
  montant: number;
  createdAt: string;
  mode: string;
}

export function useDashboardLists() {
  const { user, loading: authLoading } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [recentPayslips, setRecentPayslips] = useState<Array<Payslip & { employe: Employe | undefined }>>([]);
  const [recentPayments, setRecentPayments] = useState<Array<Paiement & { employe: Employe | undefined }>>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<Array<Payslip & { employe: Employe | undefined }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entrepriseId || !user || authLoading) return;
    let unsub: (() => void) | null = null;
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const employes = await fetchEmployes(entrepriseId);
        // Récupérer tous les payslips de chaque employé
        const payslipsArrays = await Promise.all(
          employes.map((e) => apiFetch(`/payslip/employe/${e.id}`))
        );
        const payslips = payslipsArrays.flat();
        // Trier par date décroissante
        const sortedPayslips = payslips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Associer employé à chaque payslip
        const payslipsWithEmploye = sortedPayslips.map((p) => ({ ...p, employe: employes.find(e => e.id === p.employeId) }));
        setRecentPayslips(payslipsWithEmploye.slice(0, 5));
        // Paiements récents
        const paiementsArrays = await Promise.all(
          sortedPayslips.map((p) => apiFetch(`/paiement/payslip/${p.id}`))
        );
        const paiements = paiementsArrays.flat();
        const sortedPaiements = paiements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Associer employé à chaque paiement
        const paiementsWithEmploye = sortedPaiements.map((pay) => {
          const payslip = sortedPayslips.find(p => p.id === pay.payslipId);
          const employe = payslip ? employes.find(e => e.id === payslip.employeId) : undefined;
          return { ...pay, employe };
        });
        setRecentPayments(paiementsWithEmploye.slice(0, 5));
        // Prochains paiements = payslips EN_ATTENTE
        const upcoming = payslipsWithEmploye.filter(p => p.statut === 'EN_ATTENTE');
        setUpcomingPayments(upcoming.slice(0, 5));
      } catch {
        setError('Erreur lors du chargement des listes');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
    unsub = on('paiement:created', () => fetchLists());

    return () => {
      if (unsub) unsub();
    };
  }, [entrepriseId, user, authLoading]);

  return { recentPayslips, recentPayments, upcomingPayments, loading, error };
}
