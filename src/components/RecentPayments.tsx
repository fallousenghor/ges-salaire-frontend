import { messagesFr } from '../utils/message.fr';
import { useDashboardLists } from '../hooks/useDashboardLists';

export const RecentPayments = () => {
  const { recentPayments, loading, error } = useDashboardLists();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{messagesFr.derniersPaiements}</h3>
      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
      <ul className="space-y-2">
        {loading ? (
          <li className="text-gray-400">Chargement...</li>
        ) : recentPayments.length === 0 ? (
          <li className="text-gray-400">Aucun paiement récent</li>
        ) : recentPayments.map((pay) => (
          <li key={pay.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/avatar-default.svg" alt={pay.employe?.nomComplet || 'Employé'} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-gray-700">{pay.employe?.nomComplet || 'Employé'}</span>
            </div>
            <span className="text-sm text-gray-500">{new Date(pay.createdAt).toLocaleDateString('fr-FR')}</span>
            <span className="text-green-600 font-semibold">{pay.montant?.toLocaleString()} FCFA</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
