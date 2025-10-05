
import { Users, BarChart3, CreditCard, AlertCircle } from 'lucide-react';
import { messagesFr } from '../utils/message.fr';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { RecentPayslips } from '../components/RecentPayslips';
import { RecentPayments } from '../components/RecentPayments';
import { UpcomingPayments } from '../components/UpcomingPayments';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../hooks/useAuth';
import { PayrollEvolutionChart } from '../components/PayrollEvolutionChart';

export const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { actifs, masseSalariale, montantPaye, montantRestant, loading, error } = useDashboardStats();

  // Si pas d'utilisateur connecté, afficher un dashboard vide
  if (!user) {
    return (
      <div className="flex-1 p-6 bg-theme-primary/5 flex items-center justify-center">
        <div className="text-theme-secondary/60">Veuillez vous connecter</div>
      </div>
    );
  }
  
  if (authLoading) {
    return (
      <div className="flex-1 p-6 bg-theme-primary/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-theme-secondary/60">Chargement du tableau de bord...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 p-6 bg-theme-primary/5 overflow-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-theme-secondary">{messagesFr.tableauBord}</h1>
        <p className="text-theme-secondary/80">{messagesFr.suiviTempsReel}</p>
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={messagesFr.masseSalarialeMois}
          value={masseSalariale.toLocaleString() + ' FCFA'}
          subtitle="↗️ +5% vs mois précédent"
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          color="green"
          isLoading={loading}
        />
        <StatCard
          key={`montant-paye-${montantPaye}`}
          title={messagesFr.montantPaye}
          value={montantPaye.toLocaleString() + ' FCFA'}
          subtitle={masseSalariale > 0 ? `${Math.round((montantPaye / masseSalariale) * 100)}% payé` : ''}
          icon={<CreditCard className="w-5 h-5 text-white" />}
          color="blue"
          isLoading={loading}
        />
        <StatCard
          title={messagesFr.montantRestant}
          value={loading ? '...' : montantRestant.toLocaleString() + ' FCFA'}
          subtitle={loading ? '' : masseSalariale > 0 ? `${Math.round((montantRestant / masseSalariale) * 100)}% restant à payer` : ''}
          icon={<AlertCircle className="w-5 h-5 text-white" />}
          color="orange"
        />
        <StatCard
          title={messagesFr.employesActifs}
          value={loading ? '...' : actifs.toString()}
          subtitle={messagesFr.nouveauxCeMois}
          icon={<Users className="w-5 h-5 text-white" />}
          color="purple"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-theme-secondary mb-6">
              Évolution de la masse salariale (6 derniers mois)
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <PayrollEvolutionChart />
            </div>
          </div>
        </div>
        <div>
          
           <RecentPayslips />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPayments />
        <RecentPayments />
      </div>
    </div>
  );
};
