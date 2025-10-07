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
          <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-6.13V7a4 4 0 00-3-3.87M6 10V7a4 4 0 013-3.87m6 0A4 4 0 0118 7v3m-6 0V7a4 4 0 013-3.87" /></svg>
          <h2 className="text-3xl font-extrabold text-theme-secondary tracking-tight">Liste des employés</h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border border-theme-primary/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-primary"
            placeholder="Rechercher par matricule..."
            value={searchMatricule}
            onChange={e => setSearchMatricule(e.target.value)}
          />
          {canCreateEmploye && (
            <button
              className="bg-theme-primary hover:bg-theme-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow"
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
            <svg className="mx-auto mb-4 w-16 h-16 text-theme-primary/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-6.13V7a4 4 0 00-3-3.87M6 10V7a4 4 0 013-3.87m6 0A4 4 0 0118 7v3m-6 0V7a4 4 0 013-3.87" /></svg>
            <p className="text-lg font-semibold">Aucun employé trouvé pour cette entreprise.</p>
          </div>
        ) : (
      <div className="overflow-x-auto rounded-xl shadow-md border border-theme-primary/10 bg-white">
  <table className="min-w-full divide-y divide-theme-primary/10 text-sm">
    <thead className="bg-theme-primary/5 sticky top-0 z-10">
      <tr>
        <th className="px-6 py-4 text-left font-semibold text-theme-secondary uppercase tracking-wider">Matricule</th>
        <th className="px-6 py-4 text-left font-semibold text-theme-secondary uppercase tracking-wider">Nom complet</th>
        <th className="px-6 py-4 text-left font-semibold text-theme-secondary uppercase tracking-wider">Poste</th>
        <th className="px-6 py-4 text-center font-semibold text-theme-secondary uppercase tracking-wider">Contrat</th>
        <th className="px-6 py-4 text-right font-semibold text-theme-secondary uppercase tracking-wider">Salaire</th>
        <th className="px-6 py-4 text-right font-semibold text-theme-secondary uppercase tracking-wider">Taux J.</th>
        <th className="px-6 py-4 text-right font-semibold text-theme-secondary uppercase tracking-wider">Honoraire</th>
        <th className="px-6 py-4 text-center font-semibold text-theme-secondary uppercase tracking-wider">Actif</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-theme-primary/5">
      {filteredEmployes.map((employe, idx) => (
        <tr
          key={employe.id}
          className={`transition-colors ${
            idx % 2 === 0 ? "bg-white" : "bg-theme-primary/5"
          } hover:bg-theme-primary/10 cursor-pointer`}
          onClick={() => navigate(`/employes/${employe.id}`)}
        >
          <td className="px-6 py-4 font-mono text-theme-primary">{employe.badge?.matricule || '-'}</td>
          <td className="px-6 py-4 font-medium text-gray-800">{employe.nomComplet}</td>
          <td className="px-6 py-4 text-gray-600">{employe.poste}</td>
          <td className="px-6 py-4 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-theme-primary/10 text-theme-primary">
              {employe.typeContrat}
            </span>
          </td>
          <td className="px-6 py-4 text-right font-mono text-theme-primary font-semibold">
            {employe.salaireFixe?.toLocaleString() || "-"} FCFA
          </td>
          <td className="px-6 py-4 text-right font-mono text-theme-primary">
            {typeof employe.tauxJournalier === "number"
              ? `${employe.tauxJournalier.toLocaleString()} FCFA`
              : "-"}
          </td>
          <td className="px-6 py-4 text-right font-mono text-theme-primary">
            {typeof employe.honoraire === "number"
              ? `${employe.honoraire.toLocaleString()} FCFA`
              : "-"}
          </td>
          <td className="px-6 py-4 text-center">
            {employe.actif ? (
              <span className="inline-flex items-center gap-1 text-theme-primary font-medium">
                <span className="w-3 h-3 bg-theme-primary rounded-full"></span> Oui
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-gray-400 font-medium">
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span> Non
              </span>
            )}
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
