import { Download } from 'lucide-react';
import { messagesFr } from '../utils/message.fr';
import { useDashboardLists } from '../hooks/useDashboardLists';

export const UpcomingPayments = () => {
  const { upcomingPayments, loading, error } = useDashboardLists();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{messagesFr.prochainsPaiements}</h3>
      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
      <ul className="space-y-3">
        {loading ? (
          <li className="text-gray-400">Chargement...</li>
        ) : upcomingPayments.length === 0 ? (
          <li className="text-gray-400">Aucun paiement à venir</li>
        ) : upcomingPayments.map((p) => (
          <li key={p.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/avatar-default.svg" alt={p.employe?.nomComplet || 'Employé'} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-gray-700">{p.employe?.nomComplet || 'Employé'}</span>
            </div>
            <span className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
            <span className="text-green-600 font-semibold">{p.netAPayer?.toLocaleString()} FCFA</span>
            <button className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center"><Download className="w-3 h-3 mr-1" /> {messagesFr.recu}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
