import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";
import { payerPayslip } from "../services/paiementService";
import { emit } from "../utils/eventBus";
import Pagination from "./common/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/payslip/payrun/${payrunId}?page=${currentPage}&limit=10`)
      .then((data) => {
        console.log('Pagination data:', data);
        // Si data est un tableau, considérer qu'il n'y a qu'une seule page
        if (Array.isArray(data)) {
          setPayslips(data);
          setTotalPages(1);
          setHasMore(false);
        } else {
          // Sinon utiliser la structure paginée
          setPayslips(data.items || []);
          setTotalPages(data.totalPages || 1);
          setHasMore(data.hasMore || false);
        }
      })
      .catch(() => setError("Erreur de chargement des bulletins."))
      .finally(() => setLoading(false));
  }, [payrunId, currentPage]);

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
    <div className="space-y-6">
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-theme-primary/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Employé</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Net à payer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Approbation</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payslips.map((p) => (
              <tr key={p.id} className="hover:bg-theme-primary/5 transition-all duration-150">
                <td className="px-4 py-3 font-medium text-theme-secondary">{p.employe.nomComplet}</td>
                <td className="px-4 py-3 font-semibold text-theme-primary">{p.netAPayer.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  {p.statut === "PAYE" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-theme-primary/20 text-theme-primary"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Payé</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-theme-secondary/20 text-theme-secondary"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>En attente</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.approuveAdmin ? (
                    <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-theme-primary/20 text-theme-primary">Approuvé</span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-theme-secondary/20 text-theme-secondary">En attente</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {payrunStatut === 'APPROUVE' ? (
                    // Si le cycle est approuvé, autoriser le paiement des bulletins non payés
                    p.statut !== "PAYE" ? (
                      <button
                        className="bg-theme-primary hover:bg-theme-primary/90 text-white px-4 py-1.5 rounded-xl shadow font-bold transition-all duration-150"
                        disabled={payingId === p.id}
                        onClick={() => handlePayer(p.id, p.netAPayer)}
                      >
                        {payingId === p.id ? (
                          <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/></svg>Paiement...</span>
                        ) : "Payer"}
                      </button>
                    ) : (
                      <span className="text-theme-primary font-bold">Payé</span>
                    )
                  ) : (
                    <span className="text-theme-secondary/40">Cycle non approuvé</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination en bas du tableau */}
      {payslips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg py-4 px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
