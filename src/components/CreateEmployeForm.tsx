import React from "react";

import type { Employe } from "../types/employe";
import { createEmploye } from "../services/employeService";

export interface CreateEmployeFormProps {
  onClose: () => void;
  entrepriseId?: number;
  onCreated?: () => void;
}

const defaultEmploye: Omit<Employe, "id" | "entreprise" | "createdAt" | "updatedAt"> = {
  nomComplet: "",
  poste: "",
  typeContrat: "FIXE",
  salaireFixe: undefined,
  tauxJournalier: undefined,
  honoraire: undefined,
  coordonneesBancaires: "",
  statut: "ACTIF",
  actif: true,
};

export function CreateEmployeForm({ onClose, entrepriseId, onCreated }: CreateEmployeFormProps) {
  const [form, setForm] = React.useState<typeof defaultEmploye>(defaultEmploye);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | number | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    if (["salaireFixe", "tauxJournalier", "honoraire"].includes(name)) {
      fieldValue = value === "" ? "" : Number(value);
    }
    setForm(f => ({
      ...f,
      [name]: fieldValue,
    }));
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!entrepriseId) throw new Error("Entreprise ID manquant");
      // Construction du payload complet pour correspondre à EmployeApi
      const payload = {
        entrepriseId,
        nomComplet: form.nomComplet,
        poste: form.poste ?? "",
        typeContrat: form.typeContrat,
  salaireFixe: form.salaireFixe ?? 0,
  tauxJournalier: form.tauxJournalier ?? undefined,
  honoraire: form.honoraire ?? undefined,
        coordonneesBancaires: form.coordonneesBancaires ?? "",
        statut: form.statut,
        actif: form.actif,
      };
      await createEmploye(payload);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError((err instanceof Error ? err.message : "Erreur lors de la création"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div className="text-gray-500 mb-2">Création en cours...</div>}
      <h3 className="text-xl font-bold mb-4 text-green-700">Créer un employé</h3>
      <div className="mb-3">
        <label className="block font-semibold mb-1">Nom complet</label>
        <input name="nomComplet" value={form.nomComplet} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-3">
        <label className="block font-semibold mb-1">Poste</label>
        <input name="poste" value={form.poste ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-3">
        <label className="block font-semibold mb-1">Type de contrat</label>
        <select name="typeContrat" value={form.typeContrat} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="FIXE">Fixe</option>
          <option value="JOURNALIER">Journalier</option>
          <option value="HONORAIRE">Honoraire</option>
        </select>
      </div>
      {form.typeContrat === "FIXE" && (
        <div className="mb-3">
          <label className="block font-semibold mb-1">Salaire fixe</label>
          <input name="salaireFixe" type="number" value={form.salaireFixe ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      {form.typeContrat === "JOURNALIER" && (
        <div className="mb-3">
          <label className="block font-semibold mb-1">Taux journalier</label>
          <input name="tauxJournalier" type="number" value={form.tauxJournalier ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      {form.typeContrat === "HONORAIRE" && (
        <div className="mb-3">
          <label className="block font-semibold mb-1">Honoraire</label>
          <input name="honoraire" type="number" value={form.honoraire ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      <div className="mb-3">
        <label className="block font-semibold mb-1">Coordonnées bancaires</label>
        <input name="coordonneesBancaires" value={form.coordonneesBancaires ?? ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-3">
        <label className="block font-semibold mb-1">Statut</label>
        <select name="statut" value={form.statut} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="ACTIF">Actif</option>
          <option value="INACTIF">Inactif</option>
          <option value="VACATAIRE">Vacataire</option>
        </select>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input name="actif" type="checkbox" checked={form.actif} onChange={handleChange} />
        <label className="font-semibold">Actif</label>
      </div>
      <div className="flex gap-3 mt-6">
  <button type="submit" className="font-bold py-2 px-4 rounded-lg shadow btn-primary">Créer</button>
  <button type="button" className="font-bold py-2 px-4 rounded-lg border border-theme-primary text-theme-primary bg-white" onClick={onClose}>Annuler</button>
      </div>
    </form>
  );
}