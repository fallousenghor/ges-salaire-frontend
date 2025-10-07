
import { useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";
import { payerPayslip } from "../services/paiementService";
import { emit } from "../utils/eventBus";
import Pagination from "../components/common/Pagination";

interface Payslip {
  id: number;
  employe: { id: number; nomComplet: string };
  netAPayer: number;
  statut: string;
  payrun: { id: number; nom: string; statut: string };
}

export default function BultinPaix() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/payslips?page=${currentPage}&limit=10`)
      .then((data) => {
        if (data.items) {
          setPayslips(data.items);
          setTotalPages(data.totalPages);
          setHasMore(data.hasMore);
        } else {
          setPayslips(data);
          setTotalPages(1);
          setHasMore(false);
        }
      })
      .catch(() => setError("Erreur de chargement des bulletins."))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handlePayer = async (payslipId: number, montant: number) => {
    setPayingId(payslipId);
    try {
      await payerPayslip({ payslipId, montant, mode: "VIREMENT" });
      // Recharge la liste depuis l'API pour garantir la persistance
      const data = await apiFetch(`/payslips?page=${currentPage}&limit=10`);
      if (data.items) {
        setPayslips(data.items);
        setTotalPages(data.totalPages);
        setHasMore(data.hasMore);
      } else {
        setPayslips(data);
        setTotalPages(1);
        setHasMore(false);
      }
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

  // Filtrage par employé ou cycle
  const filteredPayslips = payslips.filter(
    (p) =>
      p.employe.nomComplet.toLowerCase().includes(search.toLowerCase()) ||
      (p.payrun?.nom ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Statistiques
  const totalBulletins = payslips.length;
  const totalAPayer = payslips.filter(p => p.statut !== "PAYE").reduce((sum, p) => sum + p.netAPayer, 0);
  const totalPayes = payslips.filter(p => p.statut === "PAYE").length;

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-theme-secondary mb-2 flex items-center gap-2">
            <svg className="w-7 h-7 text-theme-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4v2m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
            Bulletins de paie
          </h2>
          <div className="flex gap-6 mt-2">
            <div className="bg-theme-primary/5 rounded-lg px-4 py-2 text-theme-primary font-semibold shadow-sm">Total : {totalBulletins}</div>
            <div className="bg-theme-secondary/20 rounded-lg px-4 py-2 text-theme-secondary font-semibold shadow-sm">À payer : {totalAPayer.toLocaleString()} FCFA</div>
            <div className="bg-theme-primary/20 rounded-lg px-4 py-2 text-theme-primary font-semibold shadow-sm">Payés : {totalPayes}</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="🔍 Rechercher un employé ou un cycle..."
          className="border rounded-xl px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-theme-primary shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-200 bg-white animate-fade-in">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-theme-primary/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Employé</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Cycle</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Net à payer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-theme-secondary uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayslips.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Aucun bulletin trouvé.</td>
              </tr>
            ) : (
              filteredPayslips.map((p) => (
                <tr key={p.id} className="hover:bg-theme-primary/5 transition-all duration-150">
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-theme-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" /></svg>
                    {p.employe.nomComplet}
                  </td>
                  <td className="px-4 py-3">{p.payrun?.nom ?? p.payrun?.id}</td>
                  <td className="px-4 py-3 font-semibold text-theme-primary">{p.netAPayer.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3">
                    {p.statut === "PAYE" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-theme-primary/10 text-theme-primary"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Payé</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-700"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2 items-center">
                    {p.statut !== "PAYE" && p.payrun?.statut === 'APPROUVE' ? (
                      <button
                        className="bg-gradient-to-tr from-theme-primary to-theme-secondary hover:from-theme-primary/90 hover:to-theme-secondary/90 text-white px-4 py-1.5 rounded-xl shadow font-bold transition-all duration-150"
                        disabled={payingId === p.id}
                        onClick={() => handlePayer(p.id, p.netAPayer)}
                      >
                        {payingId === p.id ? (
                          <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/></svg>Paiement...</span>
                        ) : "Payer"}
                      </button>
                    ) : p.statut === "PAYE" ? (
                      <span className="text-theme-primary font-bold">—</span>
                    ) : (
                      <span className="text-gray-400">Cycle non approuvé</span>
                    )}
                    <button
                      className="ml-2 bg-theme-secondary/20 hover:bg-theme-secondary/30 text-theme-secondary px-3 py-1 rounded-xl shadow text-xs font-bold transition-all duration-150 flex items-center gap-1"
                      title="Télécharger le PDF"
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}/payslip/${p.id}/pdf?token=${localStorage.getItem('token')}`, '_blank')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4 4-4-4" /></svg>PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {payslips.length > 0 && (
          <div className="bg-white py-4 px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              onPageChange={(page) => {
                setCurrentPage(page);
                setSearch(""); // Réinitialiser la recherche lors du changement de page
              }}
            />
          </div>
        )}
      </div>
    );
}