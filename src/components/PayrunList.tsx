import { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiFetch';
import PayslipList from './PayslipList';

interface Payrun {
  id: number;
  periodeDebut: string;
  periodeFin: string;
  typePeriode: string;
  statut: string;
}

export default function PayrunList() {
  const [payruns, setPayruns] = useState<Payrun[]>([]);
  // const [selectedPayrun, setSelectedPayrun] = useState<Payrun | null>(null);
  const handleApprove = async (payrunId: number) => {
    try {
      setLoading(true);
      await apiFetch(`/payrun/${payrunId}/statut`, {
        method: 'PATCH',
        body: JSON.stringify({ statut: 'APPROUVE' })
      });
      setPayruns((prev) => prev.map(p => p.id === payrunId ? { ...p, statut: 'APPROUVE' } : p));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError('Erreur lors de l\'approbation du cycle.');
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch('/payrun')
      .then((data) => setPayruns(data))
      .catch(() => setError('Erreur de chargement des cycles.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-theme-primary">Cycles de paie</h2>
      {loading && <div className="text-center text-gray-500">Chargement...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-theme-primary/5 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-theme-primary">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-primary">Début</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-primary">Fin</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-primary">Type</th>
              <th className="py-3 px-4 text-left font-semibold text-theme-primary">Statut</th>
              <th className="py-3 px-4 text-center font-semibold text-theme-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            {payruns.map((p, idx) => (
              <>
                <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-theme-primary/5'}>
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
                          : 'bg-theme-primary/10 text-theme-primary px-2 py-1 rounded-full text-xs font-semibold'
                    }>
                      {p.statut}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className={`transition-colors duration-150 px-4 py-1 rounded font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary
                        ${p.statut === 'APPROUVE'
                          ? 'bg-theme-primary/30 text-theme-primary cursor-not-allowed opacity-70'
                          : 'bg-theme-primary hover:bg-theme-primary/90 text-white'}`}
                      style={{ fontSize: '1.1rem', minWidth: 120 }}
                      disabled={p.statut === 'APPROUVE'}
                      onClick={() => handleApprove(p.id)}
                    >
                      {p.statut === 'APPROUVE' ? 'Approuvé' : 'Approuver'}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6}>
                    <PayslipList payrunId={p.id} payrunStatut={p.statut} />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
