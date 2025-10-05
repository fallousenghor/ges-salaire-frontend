import  { useState, useEffect, useMemo } from "react";
// import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEmployes } from "../hooks/useEmployes";
import type { Employe } from "../types/employe";
import { CreateEmployeForm } from "../components/CreateEmployeForm";
import {  getLastPointage } from "../services/pointageService";

function EmployePage() {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [refresh, setRefresh] = useState(0);
  const { employes, loading, error } = useEmployes(entrepriseId, refresh);
  const [showForm, setShowForm] = useState(false);
  const [searchMatricule, setSearchMatricule] = useState("");
  // const [pointages, setPointages] = useState<Record<number, string>>({});
  // Filtrage par matricule
  const filteredEmployes = useMemo(() => (
    employes && Array.isArray(employes)
      ? (employes as Employe[]).filter(e =>
          e.entreprise?.id === entrepriseId &&
          (searchMatricule === "" || (e.badge?.matricule && e.badge.matricule.toLowerCase().includes(searchMatricule.toLowerCase())))
        )
      : []
  ), [employes, entrepriseId, searchMatricule]);

  useEffect(() => {
    async function fetchPointages() {
      if (!filteredEmployes.length) return;
      const results: Record<number, string> = {};
      await Promise.all(filteredEmployes.map(async (employe) => {
        try {
          const res = await getLastPointage(employe.id);
          if (res?.date) results[employe.id] = res.date;
        } catch {
          // ignore
        }
      }));
      // setPointages(results);
    }
    fetchPointages();
  }, [filteredEmployes]);
  const navigate = useNavigate();

  const canCreateEmploye = user?.role?.toLowerCase() === 'admin';
  // (Déjà géré par useMemo plus haut)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-6.13V7a4 4 0 00-3-3.87M6 10V7a4 4 0 013-3.87m6 0A4 4 0 0118 7v3m-6 0V7a4 4 0 013-3.87" /></svg>
          <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">Liste des employés</h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Rechercher par matricule..."
            value={searchMatricule}
            onChange={e => setSearchMatricule(e.target.value)}
          />
          {canCreateEmploye && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              onClick={() => setShowForm(true)}
            >
              + Créer employé
            </button>
          )}
        </div>
      </div>
      {showForm && canCreateEmploye && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowForm(false)}
              aria-label="Fermer"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <CreateEmployeForm
              onClose={() => setShowForm(false)}
              entrepriseId={entrepriseId}
              onCreated={() => setRefresh(r => r + 1)}
            />
          </div>
        </div>
      )}
      {loading && <div className="text-gray-500 animate-pulse">Chargement...</div>}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {!loading && !error && (
        Array.isArray(filteredEmployes) && filteredEmployes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <svg className="mx-auto mb-4 w-16 h-16 text-green-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-6.13V7a4 4 0 00-3-3.87M6 10V7a4 4 0 013-3.87m6 0A4 4 0 0118 7v3m-6 0V7a4 4 0 013-3.87" /></svg>
            <p className="text-lg font-semibold">Aucun employé trouvé pour cette entreprise.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-green-100 bg-white">
            <table className="min-w-full divide-y divide-green-100">
              <thead className="bg-gradient-to-r from-green-50 to-green-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Nom complet</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Poste</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Type contrat</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Salaire fixe</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Taux journalier</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Honoraire</th>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Coord. bancaires</th> */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Actif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {filteredEmployes.map((employe, idx) => (
                  <tr
                    key={employe.id}
                    className={
                      (idx % 2 === 0 ? "bg-white hover:bg-green-50 transition" : "bg-green-50 hover:bg-green-100 transition") +
                      " cursor-pointer"
                    }
                    onClick={() => navigate(`/employes/${employe.id}`)}
                  >
                    <td className="px-6 py-4 font-mono text-green-700 whitespace-nowrap">{employe.badge?.matricule || '-'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2">
                      {employe.nomComplet}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{employe.poste}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${employe.typeContrat === 'FIXE' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{employe.typeContrat}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap font-mono font-bold">{employe.salaireFixe?.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap font-mono">{typeof employe.tauxJournalier === 'number' ? `${employe.tauxJournalier.toLocaleString()} FCFA` : '-'}</td>
                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap font-mono">{typeof employe.honoraire === 'number' ? `${employe.honoraire.toLocaleString()} FCFA` : '-'}</td>
                    {/* <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{employe.coordonneesBancaires}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employe.actif ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold"><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span> Oui</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 font-semibold"><span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span> Non</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={(() => {
                          const last = pointages[employe.id];
                          if (!last) return false;
                          const lastDate = new Date(last);
                          const now = new Date();
                          return lastDate.getFullYear() === now.getFullYear() &&
                                 lastDate.getMonth() === now.getMonth() &&
                                 lastDate.getDate() === now.getDate();
                        })()}
                        onClick={async e => {
                          e.stopPropagation();
                          try {
                            await pointerEmploye(employe.id);
                            toast.success('Pointage enregistré !');
                            setPointages(p => ({ ...p, [employe.id]: new Date().toISOString() }));
                          } catch {
                            toast.error('Erreur lors du pointage');
                          }
                        }}
                      >
                        Pointage
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );

}

export default EmployePage;
