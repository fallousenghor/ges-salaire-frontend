import { useState, useEffect } from "react";
import type { EntrepriseFormData } from "../types/entreprise";
import { createEntreprise, updateEntreprise, getEntreprise } from "../services/entrepriseService";
import { messagesFr } from '../utils/message.fr';

const defaultValues: Partial<EntrepriseFormData> = {
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  logo: "",
  devise: "XOF",
  typePeriode: "MENSUEL",
};

export function useEntrepriseForm(entrepriseId?: string) {
  const [form, setForm] = useState<Partial<EntrepriseFormData>>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entrepriseId) {
      setLoading(true);
      getEntreprise(entrepriseId)
        .then((data) => setForm(data.data))
        .catch(() => setError(messagesFr.erreurChargement))
        .finally(() => setLoading(false));
    }
  }, [entrepriseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === "typePeriode") {
      value = value.toUpperCase();
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccess?: () => void
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Vérification des champs requis
      if (!form.nom || !form.email || !form.telephone || !form.devise || !form.typePeriode) {
        setError("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      // Création d'un objet FormData
      const formData = new FormData();
      
      // Ajout des champs du formulaire
      // Ajout des champs requis et optionnels
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'logo' && value instanceof File) {
            formData.append('logo', value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (entrepriseId) {
        await updateEntreprise(entrepriseId, formData);
      } else {
        await createEntreprise(formData);
      }
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(messagesFr.erreurEnregistrement);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    setError,
    handleChange,
    handleSubmit,
  };
}
