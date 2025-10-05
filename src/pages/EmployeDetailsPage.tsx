import React, { useEffect, useState } from "react";
import { getNbPointages } from "../services/pointageService";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEmployes } from "../hooks/useEmployes";
import type { Employe } from "../types/employe";
import type { Payslip } from "../types/payslip";
import { getPayslipsByEmploye, downloadPayslipPDF } from "../services/payslipService";

const EmployeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const employeId = Number(id);
  const [nbPointages, setNbPointages] = useState<number | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loadingPayslips, setLoadingPayslips] = useState(false);
  const [payslipsError, setPayslipsError] = useState<string | null>(null);

  // Récupération des pointages
  useEffect(() => {
    if (!employeId) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    getNbPointages(employeId, start, end).then(setNbPointages);
  }, [employeId]);

  // Récupération des bulletins de paie
  useEffect(() => {
    if (!employeId) return;
    setLoadingPayslips(true);
    setPayslipsError(null);
    
    getPayslipsByEmploye(employeId)
      .then(data => {
        // Trier les bulletins par date de création (du plus récent au plus ancien)
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Ne garder que les 3 derniers
        setPayslips(sorted.slice(0, 3));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des bulletins:', error);
        setPayslipsError("Impossible de charger les bulletins de paie");
      })
      .finally(() => {
        setLoadingPayslips(false);
      });
  }, [employeId]);
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const { employes } = useEmployes(entrepriseId);
  const employe: Employe | null = Array.isArray(employes) ? (employes.find((e: Employe) => e.id === employeId) ?? null) : null;

  if (!employe) {
    return <div className="p-8 text-center text-gray-500">Aucun employé trouvé.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête avec image et infos principales */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 p-8">
          {/* Image de profil */}
          <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden border-4 border-green-200 shadow-lg bg-gray-100 flex-shrink-0">
            <img
              src={'/fallou.jpeg'}
              alt={employe.nomComplet}
              className="w-full h-full object-cover"
              onError={e => (e.currentTarget.src = '/vite.svg')}
            />
          </div>
          
          {/* Informations principales */}
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-extrabold text-green-700 mb-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {employe.nomComplet}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-500 font-semibold">Poste</div>
                <div className="text-lg font-semibold text-gray-800 mt-1">{employe.poste || '-'}</div>
              </div>
              
              <div>
                <div className="text-gray-500 font-semibold">Type de contrat</div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${employe.typeContrat === 'FIXE' ? 'bg-blue-100 text-blue-700' : employe.typeContrat === 'JOURNALIER' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>
                    {employe.typeContrat}
                  </span>
                </div>
              </div>
              
              {employe.badge && (
                <div>
                  <div className="text-gray-500 font-semibold">Matricule</div>
                  <div className="text-lg font-mono font-bold text-green-700 mt-1">{employe.badge.matricule}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grille d'informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte des rémunérations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Rémunération</h3>
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 font-semibold">Salaire fixe</div>
              <div className="text-xl font-mono font-bold text-green-700 mt-1">{employe.salaireFixe?.toLocaleString() || '-'} FCFA</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold">Taux journalier</div>
              <div className="text-xl font-mono font-bold text-green-700 mt-1">{employe.tauxJournalier != null ? employe.tauxJournalier.toLocaleString() : '-'} FCFA</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold">Honoraire</div>
              <div className="text-xl font-mono font-bold text-green-700 mt-1">{employe.honoraire != null ? employe.honoraire.toLocaleString() : '-'} FCFA</div>
            </div>
          </div>
        </div>

        {/* Carte des informations bancaires */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Informations bancaires</h3>
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 font-semibold">Coordonnées bancaires</div>
              <div className="text-lg font-mono text-gray-800 mt-1 break-all">{employe.coordonneesBancaires || '-'}</div>
            </div>
          </div>
        </div>

        {/* Carte de statut et pointage */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Statut & Pointage</h3>
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 font-semibold">Statut</div>
              <div className="text-lg font-semibold mt-1">{employe.statut}</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold">État du compte</div>
              <div className="text-lg font-semibold mt-1">
                {employe.actif ? 
                  <span className="text-green-600">Actif</span> : 
                  <span className="text-gray-400">Inactif</span>
                }
              </div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold">Pointages ce mois</div>
              <div className="text-lg font-bold mt-1">{nbPointages !== null ? nbPointages : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge QR Code */}
      {employe.badge && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Badge d'identification</h3>
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 via-white to-green-50 rounded-xl border-2 border-green-100 shadow-lg max-w-sm mx-auto">
            <div className="mb-4 text-center">
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Matricule</div>
              <div className="text-2xl font-mono font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg shadow-sm border border-green-100">
                {employe.badge.matricule}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-inner border border-green-50">
              <img 
                src={employe.badge.qrCode} 
                alt="QR Code" 
                className="w-40 h-40 object-contain" 
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-500">Scannable pour le pointage</div>
              <div className="text-xs text-gray-400 mt-1">Généré le {new Date(employe.badge.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des derniers bulletins de paie */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Derniers bulletins de paie</h3>
        {loadingPayslips ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-500">Chargement des bulletins de paie...</p>
          </div>
        ) : payslipsError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">
              <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{payslipsError}</p>
          </div>
        ) : payslips.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucun bulletin de paie disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant brut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net à payer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payslips.map((payslip) => (
                  <tr key={payslip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(payslip.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payslip.brut?.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payslip.netAPayer.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${payslip.statut === 'PAYE' ? 'bg-green-100 text-green-800' : 
                        payslip.statut === 'PARTIEL' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                        {payslip.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => downloadPayslipPDF(payslip.id)}
                        className="text-green-600 hover:text-green-900 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Télécharger PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Informations système */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Informations système</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Créé le :</span> {employe.createdAt ? new Date(employe.createdAt).toLocaleString() : '-'}
          </div>
          <div>
            <span className="font-medium">Dernière mise à jour :</span> {employe.updatedAt ? new Date(employe.updatedAt).toLocaleString() : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeDetailsPage;
