import { useState, useEffect } from 'react';
import { getEntreprise } from '../services/entrepriseService';
import type { Entreprise } from '../types/entreprise';
import { useAuth } from './useAuth';

export const useCurrentEntreprise = () => {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEntreprise = async () => {
      if (!user?.entrepriseId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getEntreprise(user.entrepriseId.toString());
        setEntreprise(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchEntreprise();
  }, [user?.entrepriseId]);

  return { entreprise, loading, error };
};