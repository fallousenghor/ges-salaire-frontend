import { Download } from 'lucide-react';
import { messagesFr } from '../utils/message.fr';
import { useDashboardLists } from '../hooks/useDashboardLists';

export const UpcomingPayments = () => {
  const { upcomingPayments, loading, error } = useDashboardLists();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-theme-secondary mb-4">{messagesFr.prochainsPaiements}</h3>
      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
      <ul className="space-y-3">
        {loading ? (
          <li className="text-theme-secondary/40">Chargement...</li>
        ) : upcomingPayments.length === 0 ? (
          <li className="text-theme-secondary/40">Aucun paiement à venir</li>
        ) : upcomingPayments.map((p) => (
          <li key={p.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/avatar-default.svg" alt={p.employe?.nomComplet || 'Employé'} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-theme-secondary">{p.employe?.nomComplet || 'Employé'}</span>
            </div>
            <span className="text-sm text-theme-secondary/60">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
            <span className="text-theme-primary font-semibold">{p.netAPayer?.toLocaleString()} FCFA</span>
            <button className="ml-2 bg-theme-primary/20 text-theme-primary px-2 py-1 rounded text-xs flex items-center hover:bg-theme-primary/30 transition-colors"><Download className="w-3 h-3 mr-1" /> {messagesFr.recu}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
