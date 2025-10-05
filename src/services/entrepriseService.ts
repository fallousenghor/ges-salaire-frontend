

import { apiFetch } from "../api/apiFetch";
import type { Entreprise, EntrepriseFormData } from "../types/entreprise";


export async function getEntreprises(): Promise<{ success: boolean; data: Entreprise[] }> {
  return apiFetch("/entreprise");
}

export async function getEntreprise(id: string): Promise<{ success: boolean; data: Entreprise }> {
  return apiFetch(`/entreprise/${id}`);
}

export async function createEntreprise(data: Partial<EntrepriseFormData> | FormData): Promise<Entreprise> {
  const options: RequestInit = {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? {} : {
      'Content-Type': 'application/json',
    }
  };
  return apiFetch("/entreprise", options);
}

export async function updateEntreprise(id: string, data: Partial<EntrepriseFormData> | FormData): Promise<Entreprise> {
  const options: RequestInit = {
    method: "PUT",
    body: data instanceof FormData ? data : JSON.stringify(data),
  };
  
  if (!(data instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  return apiFetch(`/entreprise/${id}`, options);
}

export async function deleteEntreprise(id: string): Promise<void> {
  await apiFetch(`/entreprise/${id}`, {
    method: "DELETE",
  });
}

export async function closeEntreprise(id: string): Promise<Entreprise> {
  return apiFetch(`/entreprise/${id}/fermer`, {
    method: "PUT",
  });
}