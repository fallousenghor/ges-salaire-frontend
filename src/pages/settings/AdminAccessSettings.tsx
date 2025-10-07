import React from 'react';
import { SuperAdminAccessList } from '../../components/SuperAdmin/SuperAdminAccessList';
import { useCurrentEntreprise } from '../../hooks/useCurrentEntreprise';

export const AdminAccessSettings = () => {
  const { entreprise, loading, error } = useCurrentEntreprise();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue: {error}</div>;
  if (!entreprise) return <div>Aucune entreprise sélectionnée</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des accès Super Admin</h1>
        <p className="text-gray-600">
          Gérez les accès des super administrateurs à votre entreprise. Vous pouvez accorder ou révoquer l'accès à n'importe quel moment.
        </p>
      </div>
      <SuperAdminAccessList entrepriseId={entreprise.id} />
    </div>
  );
};