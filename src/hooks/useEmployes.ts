
import { useEffect, useState } from "react";
import { fetchEmployes } from "../services/employeService";
import type { Employe } from "../types/employe";

// entrepriseId may be undefined. When absent or invalid (0), the hook does nothing.
export function useEmployes(entrepriseId?: number, refresh?: number) {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // don't fetch when entrepriseId is missing or invalid (0)
    if (typeof entrepriseId !== 'number' || entrepriseId <= 0) return;
    setLoading(true);
    fetchEmployes(entrepriseId)
      .then(data => setEmployes(Array.isArray(data) ? data : []))
      .catch(() => setError("Erreur lors du chargement des employés."))
      .finally(() => setLoading(false));
  }, [entrepriseId, refresh]);

  return { employes, loading, error };
}
