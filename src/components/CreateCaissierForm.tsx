import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../api/apiFetch';

interface CreateCaissierFormProps {
  onSuccess?: () => void;
}

const CreateCaissierForm: React.FC<CreateCaissierFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const entrepriseId = user?.entrepriseId ? Number(user.entrepriseId) : undefined;
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!entrepriseId || isNaN(entrepriseId)) {
      setError("Impossible de créer le caissier : entreprise introuvable ou invalide.");
      setLoading(false);
      return;
    }
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          roles: [{ role: 'CAISSIER', entrepriseId: Number(entrepriseId) }],
        }),
      });
      setSuccess(true);
      setForm({ nom: '', prenom: '', email: '', motDePasse: '' });
      if (onSuccess) onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du caissier. Vérifiez les informations et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-theme-primary mb-6 text-center flex items-center gap-2 justify-center">
        <svg className="w-7 h-7 text-theme-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4v2m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
        Créer un caissier
      </h2>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Nom</label>
        <input
          type="text"
          name="nom"
          placeholder="Nom du caissier"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-primary bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Prénom</label>
        <input
          type="text"
          name="prenom"
          placeholder="Prénom du caissier"
          value={form.prenom}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-primary bg-gray-50"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email du caissier"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-primary bg-gray-50"
        />
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">Mot de passe</label>
        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe temporaire"
          value={form.motDePasse}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-theme-primary bg-gray-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Création...' : 'Créer le caissier'}
      </button>
      {error && <div className="mt-4 text-red-600 text-center font-semibold">{error}</div>}
      {success && <div className="mt-4 text-theme-primary text-center font-semibold">Caissier créé avec succès !</div>}
    </form>
  );
};

export default CreateCaissierForm;
