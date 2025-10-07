import { type ReactElement, useEffect, useState, useCallback, useMemo } from "react";
import CompanyForm from "./CompanyForm";
import { Edit3, Trash2, Power, Loader2, LogIn } from "lucide-react";
import { getEntreprises, deleteEntreprise as deleteEntrepriseApi, closeEntreprise as closeEntrepriseApi } from "../services/entrepriseService";
import { superAdminAccessService } from "../services/superAdminAccess.service";

import type { Entreprise } from "../types/entreprise";
import { messagesFr } from "../utils/message.fr";
import EntrepriseDetails from "./EntrepriseDetails";
import { getLogoUrl } from '../utils/uploads';
import toast from 'react-hot-toast';
import Pagination from "./common/Pagination";

import type { User } from "../context/AuthContextOnly";

const CompanyList = (): ReactElement => {
  // États
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [editEntreprise, setEditEntreprise] = useState<Entreprise | null>(null);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [accessLoadingState, setAccessLoadingState] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Mémorisation du user
  const user = useMemo<User | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  // Helper functions
  const deleteEntreprise = useCallback(async (id: number): Promise<void> => {
    await deleteEntrepriseApi(String(id));
  }, []);

  const closeEntreprise = useCallback(async (id: number): Promise<void> => {
    await closeEntrepriseApi(String(id));
  }, []);

  const handleAccessEntreprise = async (entrepriseId: number) => {
    try {
      setAccessLoadingState(entrepriseId);
      
      // Trouver l'entreprise dans la liste
      const entreprise = entreprises.find(e => e.id === entrepriseId);
      if (!entreprise) {
        throw new Error('Entreprise non trouvée');
      }

      // Faire une requête pour obtenir un nouveau token avec les droits d'admin pour cette entreprise
      const response = await superAdminAccessService.switchToAdmin(entrepriseId);
      const { token, user: updatedUser } = response.data;

      // Sauvegarder le nouveau token
      localStorage.setItem('token', token);
      
      // Sauvegarder l'entreprise actuelle
      localStorage.setItem('currentEntreprise', JSON.stringify(entreprise));
      
      // Sauvegarder les informations utilisateur mises à jour
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Rediriger vers le dashboard de l'entreprise
      window.location.href = `/dashboard`;
    } catch (error) {
      console.error('Erreur lors de l\'accès à l\'entreprise:', error);
      toast.error('Erreur lors de l\'accès à l\'entreprise');
    } finally {
      setAccessLoadingState(null);
    }
  };
  const fetchEntreprises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEntreprises(currentPage);
      const { items, totalPages: total, hasMore: more } = response.data;
      console.log('Entreprises reçues (détaillé):', JSON.stringify(items, null, 2));
      console.log('User actuel:', user);
      setEntreprises(items);
      setTotalPages(total);
      setHasMore(more);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(messagesFr.erreurChargement);
    } finally {
      setLoading(false);
    }
  }, [currentPage, user]);

  useEffect(() => {
    fetchEntreprises();
  }, [fetchEntreprises]);

  const handleDelete = (id: number) => {
    toast((t) => (
      <span>
        {messagesFr.supprimerEntreprise}
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteEntreprise(id);
                setEntreprises(entreprises.filter(e => e.id !== id));
                toast.success('Entreprise supprimée avec succès');
              } catch (e: unknown) {
                if (e instanceof Error) toast.error(e.message);
                else toast.error(messagesFr.erreurSupression);
              }
            }}
          >Oui</button>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >Non</button>
        </div>
      </span>
    ), { duration: 8000 });
  };

  const handleClose = (id: number) => {
    toast((t) => (
      <span>
        {messagesFr.fermerEntreprise}
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await closeEntreprise(id);
                fetchEntreprises();
                toast.success('Entreprise fermée avec succès');
              } catch (e: unknown) {
                if (e instanceof Error) toast.error(e.message);
                else toast.error(messagesFr.erreurFermeture);
              }
            }}
          >Oui</button>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >Non</button>
        </div>
      </span>
    ), { duration: 8000 });
  };

  // Filtrage combiné (utilisateur + recherche + statut)
  const filteredEntreprises = useMemo(() => {
    if (!entreprises) return [];
    
    const filtered = [...entreprises];

    // Pour le super admin, pas de filtrage - il voit toutes les entreprises
    // Le filtrage se fait uniquement au niveau du bouton d'accès    // Filtre par recherche et statut
    return filtered.filter((company) => {
      const matchSearch = company.nom.toLowerCase().includes(search.toLowerCase());
      const matchStatut = statutFilter === "all" || company.statut === statutFilter;
      return matchSearch && matchStatut;
    });
  }, [entreprises, search, statutFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Chargement...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    toast.error(error);
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Une erreur est survenue</div>
      </div>
    );
  }
  
  // Return du JSX
  return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col gap-4 px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Liste des entreprises</h1>
                <button
                  className="flex items-center cursor-pointer gap-2 py-2 px-5 rounded-lg shadow transition-all duration-300 hover:scale-105 btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <span className="font-semibold">{messagesFr.creerEntreprise}</span>
                </button>
              </div>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-64"
              />
              <select
                value={statutFilter}
                onChange={e => setStatutFilter(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">Tous</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Logo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Adresse</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Téléphone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Devise</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Créée le</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntreprises.map((company, index) => (
                  <tr key={company.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-3">
                      {company.logo ? (
                        <img 
                          src={getLogoUrl(company.logo) ?? "/avatar-default.svg"} 
                          alt={company.nom} 
                          className="w-10 h-10 rounded-full object-cover border shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = "/avatar-default.svg";
                          }} 
                        />
                      ) : (
                        <img src="/avatar-default.svg" alt="Avatar par défaut" className="w-10 h-10 rounded-full object-cover border bg-gray-200" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{company.nom}</td>
                    <td className="px-4 py-3 text-gray-600">{company.adresse || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{company.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{company.telephone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {company.devise || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.statut === 'active'
                          ? 'bg-green-100 text-green-800' 
                          : company.statut === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.statut === 'active' ? 'Actif' : company.statut === 'inactive' ? 'Inactif' : company.statut || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-white text-theme-primary border border-theme-primary"
                          onClick={() => setEditEntreprise(company)}
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-red-50 text-red-600 border border-red-600"
                          onClick={() => handleDelete(Number(company.id))}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-gray-100 text-gray-700 border border-gray-400"
                          onClick={() => handleClose(Number(company.id))}
                          title="Fermer"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Bouton d'accès pour le super admin */}
                        {user?.role === 'SUPER_ADMIN' && (
                          company.superAdminAccess?.some(access => 
                            access.superAdmin.user.id === Number(user?.id) && access.hasAccess
                          ) ? (
                            <button 
                              className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-green-50 text-green-600 border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleAccessEntreprise(Number(company.id))}
                              disabled={accessLoadingState === company.id}
                              title="Accéder en tant qu'admin"
                            >
                              {accessLoadingState === company.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button 
                              className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-gray-100 text-gray-400 border border-gray-300"
                              disabled
                              title="En attente d'invitation"
                            >
                              <LogIn className="w-4 h-4" />
                            </button>
                          )
                        )}
                        <button
                          className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md bg-theme-secondary/10 text-theme-secondary border border-theme-secondary"
                          onClick={() => setSelectedEntreprise(company)}
                          title="Détails"
                        >
                          <span className="font-bold text-xs">i</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {entreprises.length > 0 && (
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
      </div>
      {/* Modal pour création entreprise */}
      {showModal && !editEntreprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Fermer"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Créer une entreprise</h2>
            <CompanyForm onSuccess={() => { setShowModal(false); fetchEntreprises(); }} />
          </div>
        </div>
      )}
      {/* Modal pour modification entreprise */}
      {editEntreprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
            <button
              onClick={() => setEditEntreprise(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Fermer"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Modifier une entreprise</h2>
            <CompanyForm entrepriseId={String(editEntreprise.id)} onSuccess={() => { setEditEntreprise(null); fetchEntreprises(); }} />
          </div>
        </div>
      )}
      {/* Modal pour détails entreprise */}
      {selectedEntreprise && (
        <EntrepriseDetails entreprise={selectedEntreprise} onClose={() => setSelectedEntreprise(null)} />
      )}
    </div>
  );
};

export default CompanyList;