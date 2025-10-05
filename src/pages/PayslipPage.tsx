
import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";
import { payerPayslip } from "../services/paiementService";
import { emit } from "../utils/eventBus";

interface Payslip {
  id: number;
  employe: { id: number; nomComplet: string };
  netAPayer: number;
  statut: string;
  payrun: { id: number; nom: string };
}

const PayslipPage = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/payslips`)
      .then((data) => setPayslips(data))
      .catch(() => setError("Erreur de chargement des bulletins."))
      .finally(() => setLoading(false));
  }, []);

  const handlePayer = async (payslipId: number, montant: number) => {
    setPayingId(payslipId);
    try {
      await payerPayslip({ payslipId, montant, mode: "VIREMENT" });
      setPayslips((prev) =>
        prev.map((p) => (p.id === payslipId ? { ...p, statut: "PAYE" } : p))
      );
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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Tous les bulletins de salaire</h2>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th>Employé</th>
            <th>Cycle</th>
            <th>Net à payer</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map((p) => (
            <tr key={p.id}>
              <td>{p.employe.nomComplet}</td>
              <td>{p.payrun?.nom ?? p.payrun?.id}</td>
              <td>{p.netAPayer} FCFA</td>
              <td>{p.statut}</td>
              <td>
                {p.statut !== "PAYE" ? (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    disabled={payingId === p.id}
                    onClick={() => handlePayer(p.id, p.netAPayer)}
                  >
                    {payingId === p.id ? "Paiement..." : "Payer"}
                  </button>
                ) : (
                  <span className="text-green-600 font-bold">Payé</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayslipPage;
