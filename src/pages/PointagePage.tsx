import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useEmployes } from "../hooks/useEmployes";
import type { Employe } from "../types/employe";
import { getLastPointage, pointerEmploye } from "../services/pointageService";



const PointagePage = () => {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const { employes, loading, error } = useEmployes(entrepriseId);
  const [pointages, setPointages] = useState<Record<number, string>>({});

  const filteredEmployes = useMemo(() => (
    employes && Array.isArray(employes)
      ? (employes as Employe[]).filter(e => e.entreprise?.id === entrepriseId)
      : []
  ), [employes, entrepriseId]);

  useEffect(() => {
    async function fetchPointages() {
      if (!filteredEmployes.length) return;
      const results: Record<number, string> = {};
      await Promise.all(filteredEmployes.map(async (employe) => {
        try {
          const res = await getLastPointage(employe.id);
          if (res?.date) results[employe.id] = res.date;
        } catch {
          // ignore individual failures
        }
      }));
      setPointages(results);
    }
    fetchPointages();
  }, [filteredEmployes]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto mb-8 bg-theme-primary/5 p-6 rounded-lg">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-theme-primary">
            Pointage - Présence
          </h2>
          <p className="text-gray-600">Gestion des présences des employés</p>
          <div className="h-1 w-20 bg-theme-primary/60 rounded-full mt-2"></div>
        </div>
      </div>

      {loading && <div className="text-gray-500 animate-pulse">Chargement...</div>}
      {error && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        Array.isArray(filteredEmployes) && filteredEmployes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Aucun employé trouvé pour cette entreprise.</div>
        ) : (
          <div className="max-w-5xl mx-auto overflow-x-auto rounded-xl shadow-lg border border-theme-primary/20 bg-white">
            <table className="w-full divide-y divide-theme-primary/10">
              <thead className="bg-theme-primary/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-theme-secondary uppercase tracking-wider w-1/6">Matricule</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-theme-secondary uppercase tracking-wider w-1/3">Nom complet</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-theme-secondary uppercase tracking-wider w-1/4">Poste</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-theme-secondary uppercase tracking-wider w-1/6">Présent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-primary/5">
                {filteredEmployes.map((employe, idx) => {
                  const last = pointages[employe.id];
                  const alreadyToday = (() => {
                    if (!last) return false;
                    const lastDate = new Date(last);
                    const now = new Date();
                    return lastDate.getFullYear() === now.getFullYear() &&
                           lastDate.getMonth() === now.getMonth() &&
                           lastDate.getDate() === now.getDate();
                  })();

                  return (
                    <tr key={employe.id} 
                        className={(idx % 2 === 0 ? 'bg-white' : 'bg-theme-primary/5') + 
                        ' hover:bg-theme-primary/10 transition-colors'}>
                      <td className="px-4 py-3 font-mono text-sm text-theme-primary">{employe.badge?.matricule || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-sm text-gray-900">{employe.nomComplet}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{employe.poste || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          className={`px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors ${
                            alreadyToday 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-theme-primary hover:bg-theme-primary/90'
                          }`}
                          disabled={alreadyToday}
                          onClick={async () => {
                            try {
                              await pointerEmploye(employe.id);
                              toast.success('Présence enregistrée');
                              setPointages(p => ({ ...p, [employe.id]: new Date().toISOString() }));
                            } catch {
                              toast.error('Erreur lors de l\'enregistrement');
                            }
                          }}
                        >
                          {alreadyToday ? 'Présent ✓' : 'Présent'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default PointagePage;
