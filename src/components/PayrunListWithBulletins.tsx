import { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiFetch';
import PayrunForm from './PayrunForm';

interface Payrun {
  id: number;
  periodeDebut: string;
  periodeFin: string;
  typePeriode: string;
  statut: string;
}

export default function PayrunListWithBulletins() {
  const [payruns, setPayruns] = useState<Payrun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch('/payrun')
      .then((data) => setPayruns(data))
      .catch(() => setError('Erreur de chargement des cycles.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-theme-primary">Cycles de paie</h2>
        <button
          className="bg-theme-primary hover:bg-theme-primary/90 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
          onClick={() => setShowForm(true)}
        >
          Ajouter un cycle
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {/* Popup du formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Nouveau cycle de paie</h3>
            <PayrunForm onSuccess={() => { setShowForm(false); setLoading(true); apiFetch('/payrun').then((data) => setPayruns(data)).finally(() => setLoading(false)); }} />
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow mb-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-theme-primary/5 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-theme-secondary">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-secondary">Début</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-secondary">Fin</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-secondary">Type</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-secondary">Statut</th>
              <th className="py-3 px-4 text-center font-semibold text-theme-secondary">Action</th>
              
            </tr>
          </thead>
          <tbody>
            {payruns.map((p, idx) => (
              <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4">{p.periodeDebut.slice(0, 10)}</td>
                <td className="py-2 px-4">{p.periodeFin.slice(0, 10)}</td>
                <td className="py-2 px-4">{p.typePeriode}</td>
                <td className="py-2 px-4">
                  <span className={
                    p.statut === 'APPROUVE'
                      ? 'bg-theme-primary/20 text-theme-primary px-2 py-1 rounded-full text-xs font-semibold'
                      : p.statut === 'CLOTURE'
                        ? 'bg-theme-secondary/20 text-theme-secondary px-2 py-1 rounded-full text-xs font-semibold'
                        : 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold'
                  }>
                    {p.statut}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className={`transition-colors duration-150 px-4 py-1 rounded font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                      ${p.statut === 'APPROUVE'
                        ? 'bg-green-400 text-white cursor-not-allowed opacity-60'
                        : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    disabled={p.statut === 'APPROUVE'}
                    onClick={async () => {
                      if (p.statut !== 'APPROUVE') {
                        setLoading(true);
                        try {
                          await apiFetch(`/payrun/${p.id}/statut`, {
                            method: 'PATCH',
                            body: JSON.stringify({ statut: 'APPROUVE' })
                          });
                          setPayruns((prev) => prev.map(payrun => payrun.id === p.id ? { ...payrun, statut: 'APPROUVE' } : payrun));
                        } catch {
                          setError("Erreur lors de l'approbation du cycle.");
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  >
                    {p.statut === 'APPROUVE' ? 'Approuvé' : 'Approuver'}
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tableau des bulletins supprimé */}
    </div>
  );
}
