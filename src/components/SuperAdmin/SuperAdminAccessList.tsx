import { useEffect, useState, useCallback } from 'react';
import { superAdminAccessService } from '../../services/superAdminAccess.service';
import { useToast } from '../../hooks/useToast';

interface SuperAdminAccessListProps {
  entrepriseId: number;
}

export const SuperAdminAccessList: React.FC<SuperAdminAccessListProps> = ({ entrepriseId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [superAdmin, setSuperAdmin] = useState<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
    hasAccess: boolean;
  } | null>(null);
  const { showToast } = useToast();

  const loadSuperAdmin = useCallback(async () => {
    try {
      setLoading(true);
      // Récupération du super admin principal
      const mainSuperAdmin = await superAdminAccessService.getMainSuperAdmin();
      if (mainSuperAdmin) {
        // Vérifier les accès actuels
        const accessList = await superAdminAccessService.getAccessList(entrepriseId);
        const currentAccess = accessList.find(access => access.superAdmin.user.id === mainSuperAdmin.id);
        
        setSuperAdmin({
          id: mainSuperAdmin.id,
          nom: mainSuperAdmin.nom,
          prenom: mainSuperAdmin.prenom,
          email: mainSuperAdmin.email,
          hasAccess: currentAccess?.hasAccess || false
        });
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des informations');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, [entrepriseId]);

  useEffect(() => {
    loadSuperAdmin();
  }, [entrepriseId, loadSuperAdmin]);

  const handleAccessToggle = async (superAdminId: number, currentAccess: boolean) => {
    try {
      await superAdminAccessService.grantAccess(superAdminId, entrepriseId, !currentAccess);
      showToast(
        !currentAccess ? 'Accès accordé avec succès' : 'Accès révoqué avec succès',
        'success'
      );
      loadSuperAdmin();
    } catch (err) {
      showToast('Erreur lors de la modification de l\'accès', 'error');
      console.error('Erreur:', err);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom Complet
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accès
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {superAdmin ? (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {superAdmin.prenom} {superAdmin.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {superAdmin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={superAdmin.hasAccess}
                        onChange={() => handleAccessToggle(superAdmin.id, superAdmin.hasAccess)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm text-gray-500">
                      {superAdmin.hasAccess ? 'Autorisé' : 'Refusé'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Chargement des informations du super administrateur...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};