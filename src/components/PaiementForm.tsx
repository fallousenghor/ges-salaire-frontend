import React, { useState } from 'react';
import { useEmployes } from '../hooks/useEmployes';
import { useAuth } from '../hooks/useAuth';
import { payerPayslip } from '../services/paiementService';
import type { ModePaiement } from '../types/shared';

interface PaiementFormProps {
  onSuccess?: () => void;
}

const PaiementForm: React.FC<PaiementFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const { employes } = useEmployes(entrepriseId ?? 0);
  const [selectedEmployes, setSelectedEmployes] = useState<number[]>([]);
  const [payslipId, setPayslipId] = useState('');
  const [mode, setMode] = useState('VIREMENT');
  const [montant, setMontant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmployeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => Number(option.value));
    setSelectedEmployes(options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await Promise.all(selectedEmployes.map(() =>
        payerPayslip({
          payslipId: Number(payslipId),
          montant: Number(montant),
          mode: mode as ModePaiement,
        })
      ));
      setSuccess(true);
      setMontant('');
      setPayslipId('');
      setSelectedEmployes([]);
      if (onSuccess) onSuccess();
    } catch {
      setError('Erreur lors du paiement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8  mx-auto mt-8 border border-gray-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center gap-2 justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        Effectuer un paiement
      </h2>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Employés concernés</label>
        <select
          multiple
          value={selectedEmployes.map(String)}
          onChange={handleEmployeChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 min-h-[48px]"
        >
          {employes.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.nomComplet}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Payslip ID</label>
        <input
          type="number"
          value={payslipId}
          onChange={e => setPayslipId(e.target.value)}
          required
          min="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Montant</label>
        <input
          type="number"
          value={montant}
          onChange={e => setMontant(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
        />
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">Mode de paiement</label>
        <select
          value={mode}
          onChange={e => setMode(e.target.value as ModePaiement)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
        >
          <option value="VIREMENT">Virement</option>
          <option value="ESPECES">Espèces</option>
          <option value="CHEQUE">Chèque</option>
          <option value="ORANGE_MONEY">Orange Money</option>
          <option value="WAVE">Wave</option>
          <option value="AUTRE">Autre</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Paiement en cours...' : 'Payer'}
      </button>
      {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}
      {success && <div className="mt-4 text-green-600 text-center font-semibold">Paiement effectué !</div>}
    </form>
  );
};

export default PaiementForm;
