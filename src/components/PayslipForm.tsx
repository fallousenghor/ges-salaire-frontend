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
  const [deductions, setDeductions] = useState('');
  const [netAPayer, setNetAPayer] = useState('');
  const [statut, setStatut] = useState<StatutPayslip>('EN_ATTENTE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createPayslip({
        employeId: Number(employeId),
        payrunId: Number(payrunId),
        brut: Number(brut),
        deductions: Number(deductions),
        netAPayer: Number(netAPayer),
        statut,
      });
      setSuccess(true);
      setEmployeId('');
      setPayrunId('');
      setBrut('');
      setDeductions('');
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
          onChange={e => setBrut(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Déductions</label>
        <input
          type="number"
          value={deductions}
          onChange={e => setDeductions(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Net à payer</label>
        <input
          type="number"
          value={netAPayer}
          onChange={e => setNetAPayer(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
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
