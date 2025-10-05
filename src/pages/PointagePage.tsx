import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useEmployes } from "../hooks/useEmployes";
import type { Employe } from "../types/employe";
import { pointerEmploye, getLastPointage } from "../services/pointageService";

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-700">Pointage - Présence</h2>
      </div>

      {loading && <div className="text-gray-500 animate-pulse">Chargement...</div>}
      {error && <div className="text-red-500 font-semibold">{error}</div>}

      {!loading && !error && (
        Array.isArray(filteredEmployes) && filteredEmployes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Aucun employé trouvé pour cette entreprise.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-green-100 bg-white">
            <table className="min-w-full divide-y divide-green-100">
              <thead className="bg-gradient-to-r from-green-50 to-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Matricule</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Nom complet</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Poste</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Présent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
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
                    <tr key={employe.id} className={(idx % 2 === 0 ? 'bg-white' : 'bg-green-50') + ' hover:bg-green-100'}>
                      <td className="px-6 py-4 font-mono text-green-700">{employe.badge?.matricule || '-'}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{employe.nomComplet}</td>
                      <td className="px-6 py-4 text-gray-700">{employe.poste || '-'}</td>
                      <td className="px-6 py-4">
                        <button
                          className={`px-3 py-1 rounded font-bold text-white ${alreadyToday ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
