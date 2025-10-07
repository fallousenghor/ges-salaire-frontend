import React, { useState } from 'react';
import { useEmployes } from '../hooks/useEmployes';
import { useAuth } from '../hooks/useAuth';
import { createPayslip } from '../services/payslipService';
import type { StatutPayslip } from '../types/shared';

interface PayslipFormProps {
  onSuccess?: () => void;
}

const PayslipForm: React.FC<PayslipFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const { employes } = useEmployes(entrepriseId ?? 0);
  const [employeId, setEmployeId] = useState('');
  const [payrunId, setPayrunId] = useState('');
  const [brut, setBrut] = useState('');
  const [netAPayer, setNetAPayer] = useState('');
  const [statut, setStatut] = useState<StatutPayslip>('EN_ATTENTE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calcul automatique des déductions et du net à payer
  const calculDeductions = (brutSalaire: number) => {
    const impotRevenu = brutSalaire * 0.18; // 18% d'impôt sur le revenu
    const cotisationSociale = brutSalaire > 250000 ? brutSalaire * 0.05 : brutSalaire * 0.02; // 5% ou 2% selon le seuil
    const totalDeductions = impotRevenu + cotisationSociale;
    return { impotRevenu, cotisationSociale, totalDeductions };
  };

  // Mise à jour du salaire net quand le brut change
  const updateSalaryCalculations = (brutValue: string) => {
    const brutNumber = Number(brutValue);
    if (!isNaN(brutNumber)) {
      const { totalDeductions } = calculDeductions(brutNumber);
      const net = brutNumber - totalDeductions;
      setNetAPayer(net.toString());
    } else {
      setNetAPayer('');
    }
  };

  // Gestionnaire de changement pour le salaire brut
  const handleBrutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrut = e.target.value;
    setBrut(newBrut);
    updateSalaryCalculations(newBrut);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const brutNumber = Number(brut);
      const { impotRevenu, cotisationSociale, totalDeductions } = calculDeductions(brutNumber);
      // Création et envoi du bulletin de paie
      await createPayslip({
        employeId: Number(employeId),
        payrunId: Number(payrunId),
        brut: brutNumber,
        deductions: totalDeductions,
        impotRevenu,
        cotisationSociale,
        netAPayer: brutNumber - totalDeductions,
        statut,
      });
      setSuccess(true);
      setEmployeId('');
      setPayrunId('');
      setBrut('');
      setNetAPayer('');
      setStatut('EN_ATTENTE');
      if (onSuccess) onSuccess();
    } catch {
      setError('Erreur lors de la création de la fiche de paie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl  p-8   mx-auto mt-8 border border-gray-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold  mb-6 text-center flex items-center gap-2 justify-center">
        <svg className="w-7 h-7 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        Créer une fiche de paie
      </h2>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Employé</label>
        <select
          value={employeId}
          onChange={e => setEmployeId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        >
          <option value="">Sélectionner un employé</option>
          {employes.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.nomComplet}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Payrun ID</label>
        <input
          type="number"
          value={payrunId}
          onChange={e => setPayrunId(e.target.value)}
          required
          min="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Salaire brut</label>
        <input
          type="number"
          value={brut}
          onChange={handleBrutChange}
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />
      </div>
      {brut && Number(brut) > 0 && (
        <div className="mb-5 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3">Détails des déductions</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Impôt sur le revenu (18%)</span>
              <span>{(Number(brut) * 0.18).toLocaleString()} FCFA</span>
            </p>
            <p className="flex justify-between">
              <span>Cotisation sociale ({Number(brut) > 250000 ? '5%' : '2%'})</span>
              <span>{(Number(brut) * (Number(brut) > 250000 ? 0.05 : 0.02)).toLocaleString()} FCFA</span>
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="flex justify-between font-semibold">
                <span>Total des déductions</span>
                <span>{(Number(brut) * 0.18 + Number(brut) * (Number(brut) > 250000 ? 0.05 : 0.02)).toLocaleString()} FCFA</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Net à payer</label>
        <input
          type="number"
          value={netAPayer}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-semibold"
        />
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">Statut</label>
        <select
          value={statut}
          onChange={e => setStatut(e.target.value as StatutPayslip)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        >
          <option value="EN_ATTENTE">En attente</option>
          <option value="PARTIEL">Partiel</option>
          <option value="PAYE">Payé</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg shadow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Création en cours...' : 'Créer la fiche de paie'}
      </button>
      {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}
      {success && <div className="mt-4 text-green-600 text-center font-semibold">Fiche de paie créée !</div>}
    </form>
  );
};

export default PayslipForm;
