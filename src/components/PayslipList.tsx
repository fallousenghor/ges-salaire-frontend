import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";
import { payerPayslip } from "../services/paiementService";
import { emit } from "../utils/eventBus";

interface Payslip {
  id: number;
  employe: { id: number; nomComplet: string };
  netAPayer: number;
  statut: string;
  approuveAdmin?: boolean;
}

interface Props {
  payrunId: number;
  payrunStatut: string;
}

export default function PayslipList({ payrunId, payrunStatut }: Props) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/payslip/payrun/${payrunId}`)
      .then((data) => setPayslips(data))
      .catch(() => setError("Erreur de chargement des bulletins."))
      .finally(() => setLoading(false));
  }, [payrunId]);

  const handlePayer = async (payslipId: number, montant: number) => {
    setPayingId(payslipId);
    try {
      await payerPayslip({ payslipId, montant, mode: "VIREMENT" });
      setPayslips((prev) =>
        prev.map((p) => (p.id === payslipId ? { ...p, statut: "PAYE" } : p))
      );
      // Ensure other parts of the app (dashboard) get notified with a clear payload
      try {
        emit('paiement:created', { montant, payslipId });
      } catch {
        // ignore
      }
    } catch {
      alert("Erreur lors du paiement");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Employé</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Net à payer</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Approbation</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payslips.map((p) => (
            <tr key={p.id} className="hover:bg-green-50 transition-all duration-150">
              <td className="px-4 py-3 font-medium text-gray-800">{p.employe.nomComplet}</td>
              <td className="px-4 py-3 font-semibold text-green-700">{p.netAPayer.toLocaleString()} FCFA</td>
              <td className="px-4 py-3">
                {p.statut === "PAYE" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Payé</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-700"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>En attente</span>
                )}
              </td>
              <td className="px-4 py-3">
                {p.approuveAdmin ? (
                  <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-green-50 text-green-700">Approuvé</span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-yellow-50 text-yellow-700">En attente</span>
                )}
              </td>
              <td className="px-4 py-3">
                {payrunStatut === 'APPROUVE' ? (
                  // Si le cycle est approuvé, autoriser le paiement des bulletins non payés
                  p.statut !== "PAYE" ? (
                    <button
                      className="bg-gradient-to-tr from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-1.5 rounded-xl shadow font-bold transition-all duration-150"
                      disabled={payingId === p.id}
                      onClick={() => handlePayer(p.id, p.netAPayer)}
                    >
                      {payingId === p.id ? (
                        <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/></svg>Paiement...</span>
                      ) : "Payer"}
                    </button>
                  ) : (
                    <span className="text-green-600 font-bold">Payé</span>
                  )
                ) : (
                  <span className="text-gray-400">Cycle non approuvé</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
