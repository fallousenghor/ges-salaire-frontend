import React, { useEffect, useState, useCallback, useMemo } from "react";
import CompanyForm from "./CompanyForm";
import { Edit3, Trash2, Power, Loader2 } from "lucide-react";
import { getEntreprises, deleteEntreprise as deleteEntrepriseApi, closeEntreprise as closeEntrepriseApi } from "../services/entrepriseService";
import type { Entreprise } from "../types/entreprise";
import { messagesFr } from "../utils/message.fr";
import EntrepriseDetails from "./EntrepriseDetails";
import { getLogoUrl } from '../utils/uploads';
import toast from 'react-hot-toast';


const deleteEntreprise = async (id: number) => deleteEntrepriseApi(String(id));
const closeEntreprise = async (id: number) => closeEntrepriseApi(String(id));



const CompanyList: React.FC = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [editEntreprise, setEditEntreprise] = useState<Entreprise | null>(null);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");


  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }, []);
  const fetchEntreprises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntreprises();
      let entreprises: Entreprise[] = Array.isArray(data?.data) ? data.data : [];
     
      if (user?.role === 'superadmin' && user?.id) {
        entreprises = entreprises.filter((e) => e.createurId === user.id);
      }
      setEntreprises(entreprises);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(messagesFr.erreurChargement);
    } finally {
      setLoading(false);
    }
  }, [user]);

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

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3 text-blue-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-lg font-medium">Chargement...</span>
      </div>
    </div>
  );
  
  if (error) {
    toast.error(error);
    return null;
  }

  // Filtrage local
  const filteredEntreprises = entreprises.filter((company) => {
    const matchSearch = company.nom.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || company.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  return (
    <div className="p-6 bg-gray-50 ">
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