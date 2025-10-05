import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createPayrun } from '../services/payrunService';
import type { StatutPayRun, TypePeriode } from '../types/shared';

interface PayrunFormProps {
  onSuccess?: () => void;
}

const PayrunForm: React.FC<PayrunFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [periodeDebut, setPeriodeDebut] = useState('');
  const [periodeFin, setPeriodeFin] = useState('');
  const [statut, setStatut] = useState<StatutPayRun>('BROUILLON');
  const [typePeriode, setTypePeriode] = useState<TypePeriode>('MENSUEL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Validation stricte avant envoi
    if (!entrepriseId || isNaN(entrepriseId)) {
      setError("Entreprise non trouvée ou invalide.");
      setLoading(false);
      return;
    }
    if (!periodeDebut || !periodeFin) {
      setError("Veuillez renseigner les dates de début et de fin.");
      setLoading(false);
      return;
    }
    try {
      await createPayrun({
        entrepriseId: Number(entrepriseId),
        periodeDebut: new Date(periodeDebut).toISOString(),
        periodeFin: new Date(periodeFin).toISOString(),
        typePeriode,
        statut,
      });
      setSuccess(true);
      setPeriodeDebut('');
      setPeriodeFin('');
      setStatut('BROUILLON');
      setTypePeriode('MENSUEL');
      if (onSuccess) onSuccess();
    } catch (err) {
      // Essayer d'extraire le message d'erreur backend
      if (err instanceof Error && err.message === 'API request failed') {
        // On tente de récupérer le message d'erreur précis de l'API
        try {
          const resp = await fetch(import.meta.env.VITE_API_URL + '/payrun', {
            method: 'POST',
            body: JSON.stringify({
              entrepriseId: Number(entrepriseId),
              periodeDebut: new Date(periodeDebut).toISOString(),
              periodeFin: new Date(periodeFin).toISOString(),
              typePeriode,
              statut,
            }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          const data = await resp.json();
          setError(data.error || 'Erreur lors de la création du cycle de paie.');
        } catch {
          setError('Erreur lors de la création du cycle de paie.');
        }
      } else {
        setError('Erreur lors de la création du cycle de paie.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8  mx-auto mt-8 border border-gray-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold  mb-6 text-center flex items-center gap-2 justify-center">
        <svg className="w-7 h-7 bg-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        Créer un cycle de paie
      </h2>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Début de période</label>
        <input
          type="date"
          value={periodeDebut}
          onChange={e => setPeriodeDebut(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Fin de période</label>
        <input
          type="date"
          value={periodeFin}
          onChange={e => setPeriodeFin(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Type de période</label>
        <select
          value={typePeriode}
          onChange={e => setTypePeriode(e.target.value as TypePeriode)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        >
          <option value="MENSUEL">Mensuel</option>
          <option value="HEBDO">Hebdomadaire</option>
          <option value="JOURNALIER">Journalier</option>
        </select>
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">Statut</label>
        <select
          value={statut}
          onChange={e => setStatut(e.target.value as StatutPayRun)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        >
          <option value="BROUILLON">Brouillon</option>
          <option value="APPROUVE">Approuvé</option>
          <option value="CLOTURE">Clôturé</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Création en cours...' : 'Créer le cycle de paie'}
      </button>
      {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}
      {success && (
        <div className="mt-4 text-green-600 text-center font-semibold">
          Cycle de paie créé !<br />
          <span className="text-sm text-green-700">Les bulletins de paie des employés ont été générés automatiquement pour ce cycle.</span>
        </div>
      )}
    </form>
  );
};

export default PayrunForm;
