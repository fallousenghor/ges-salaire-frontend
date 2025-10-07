import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiFetch';
import PayslipList from '../components/PayslipList';

interface Payslip {
  id: number;
  statut: string;
}

interface Payrun {
  id: number;
  periodeDebut: string;
  periodeFin: string;
  typePeriode: string;
  statut: string;
  payslips?: Payslip[];
}

const PaiementCaissierPage: React.FC = () => {
  const [payruns, setPayruns] = useState<Payrun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const loadPayrunsWithPayslips = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/payrun');
      const payrunsData = data.items || [];
      
      // Fetch payslips for each payrun
      const payrunsWithPayslips = await Promise.all(
        payrunsData.map(async (payrun: Payrun) => {
          try {
            const payslipsData = await apiFetch(`/payslip/payrun/${payrun.id}`);
            return {
              ...payrun,
              payslips: Array.isArray(payslipsData) ? payslipsData : payslipsData.items || []
            };
          } catch (error) {
            console.error(`Error fetching payslips for payrun ${payrun.id}:`, error);
            return payrun;
          }
        })
      );
      
      setPayruns(payrunsWithPayslips);
    } catch (error) {
      console.error('Error fetching payruns:', error);
      setError('Erreur de chargement des cycles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrunsWithPayslips();
  }, []);

  // Séparer les cycles en fonction de leur statut et du paiement des bulletins
  const activePayruns = payruns.filter((p) => {
    // Un cycle est actif s'il est approuvé et a au moins un bulletin non payé
    return p.statut === 'APPROUVE' && 
           p.payslips?.some(slip => slip.statut !== 'PAYE');
  });

  const completedPayruns = payruns.filter((p) => {
    // Un cycle est complété s'il est approuvé et tous ses bulletins sont payés
    return p.statut === 'APPROUVE' && 
           p.payslips?.every(slip => slip.statut === 'PAYE');
  });

  const otherPayruns = payruns.filter((p) => p.statut !== 'APPROUVE');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-theme-primary">
          {showHistory ? "Historique des paiements" : "Paiement des bulletins de salaire"}
        </h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold flex items-center gap-2 transition-all duration-150"
        >
          {showHistory ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux paiements
            </>
          ) : (
            <>
              Voir l'historique
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          )}
        </button>
      </div>

      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!showHistory ? (
        // Affichage des paiements en cours
        <>
          {activePayruns.length === 0 && !loading && (
            <div className="text-gray-500">Aucun cycle de paie en cours pour le moment.</div>
          )}
          {activePayruns.map((payrun) => (
            <div key={payrun.id} className="mb-10">
              <h3 className="font-semibold text-lg mb-2">
                Cycle #{payrun.id} — {payrun.periodeDebut.slice(0,10)} au {payrun.periodeFin.slice(0,10)} 
                <span className="ml-2 px-2 py-1 rounded bg-theme-primary/10 text-theme-primary text-xs font-bold">En cours</span>
              </h3>
              <PayslipList payrunId={payrun.id} payrunStatut={payrun.statut} />
            </div>
          ))}

          {otherPayruns.length > 0 && (
            <>
              <hr className="my-8" />
              <h3 className="text-xl font-bold mb-4 text-theme-secondary">Cycles en attente d'approbation</h3>
              {otherPayruns.map((payrun) => (
                <div key={payrun.id} className="mb-10">
                  <h3 className="font-semibold text-lg mb-2">
                    Cycle #{payrun.id} — {payrun.periodeDebut.slice(0,10)} au {payrun.periodeFin.slice(0,10)} 
                    <span className="ml-2 px-2 py-1 rounded bg-theme-secondary/10 text-theme-secondary text-xs font-bold">{payrun.statut}</span>
                  </h3>
                  <PayslipList payrunId={payrun.id} payrunStatut={payrun.statut} />
                </div>
              ))}
            </>
          )}
        </>
      ) : (
        // Affichage de l'historique (cycles complétés)
        <>
          {completedPayruns.length === 0 && !loading ? (
            <div className="text-gray-400">Aucun cycle complété dans l'historique.</div>
          ) : (
            completedPayruns.map((payrun) => (
              <div key={payrun.id} className="mb-10">
                <h3 className="font-semibold text-lg mb-2">
                  Cycle #{payrun.id} — {payrun.periodeDebut.slice(0,10)} au {payrun.periodeFin.slice(0,10)} 
                  <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Complété</span>
                </h3>
                <PayslipList payrunId={payrun.id} payrunStatut={payrun.statut} />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default PaiementCaissierPage;
