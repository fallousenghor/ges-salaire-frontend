import React from 'react';
import { SuperAdminAccessList } from '../../components/SuperAdmin/SuperAdminAccessList';
import { useCurrentEntreprise } from '../../hooks/useCurrentEntreprise';

export const SuperAdminAccessPage = () => {
  const { entreprise, loading, error } = useCurrentEntreprise();

  if (loading) {
    return <div className="p-6">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>;
  }

  if (error) {
    return <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Une erreur s'est produite lors du chargement des données : {error}
      </div>
    </div>;
  }

  if (!entreprise) {
    return <div className="p-6">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        Aucune entreprise sélectionnée
      </div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Paramètres d'accès Super Admin
        </h1>
        <p className="text-gray-600">
          Gérez les permissions d'accès des super administrateurs à votre entreprise
        </p>
      </div>
      <SuperAdminAccessList entrepriseId={entreprise.id} />
    </div>
  );
};