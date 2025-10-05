import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiFetch';
import PayslipList from '../components/PayslipList';

interface Payrun {
  id: number;
  periodeDebut: string;
  periodeFin: string;
  typePeriode: string;
  statut: string;
}

const PaiementCaissierPage: React.FC = () => {
  const [payruns, setPayruns] = useState<Payrun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch('/payrun')
      .then((data) => setPayruns(data))
      .catch(() => setError('Erreur de chargement des cycles.'))
      .finally(() => setLoading(false));
  }, []);

  // Séparation des cycles approuvés et de l'historique
  const approuvedPayruns = payruns.filter((p) => p.statut === 'APPROUVE');
  const otherPayruns = payruns.filter((p) => p.statut !== 'APPROUVE');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Paiement des bulletins de salaire (cycles approuvés)</h2>
      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {approuvedPayruns.length === 0 && !loading && (
        <div className="text-gray-500">Aucun cycle de paie approuvé pour le moment.</div>
      )}
      {approuvedPayruns.map((payrun) => (
        <div key={payrun.id} className="mb-10">
          <h3 className="font-semibold text-lg mb-2">Cycle #{payrun.id} — {payrun.periodeDebut.slice(0,10)} au {payrun.periodeFin.slice(0,10)} <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Approuvé</span></h3>
          <PayslipList payrunId={payrun.id} payrunStatut={payrun.statut} />
        </div>
      ))}
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4 text-gray-700">Historique des cycles de paie</h2>
      {otherPayruns.length === 0 && !loading && (
        <div className="text-gray-400">Aucun autre cycle de paie.</div>
      )}
      {otherPayruns.map((payrun) => (
        <div key={payrun.id} className="mb-10">
          <h3 className="font-semibold text-lg mb-2">Cycle #{payrun.id} — {payrun.periodeDebut.slice(0,10)} au {payrun.periodeFin.slice(0,10)} <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">{payrun.statut}</span></h3>
          <PayslipList payrunId={payrun.id} payrunStatut={payrun.statut} />
        </div>
      ))}
    </div>
  );
};

export default PaiementCaissierPage;
