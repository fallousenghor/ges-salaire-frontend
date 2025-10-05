import { apiFetch } from "../api/apiFetch";

export type StatutPayRun = 'BROUILLON' | 'APPROUVE' | 'CLOTURE';
export type TypePeriode = 'MENSUEL' | 'HEBDO' | 'JOURNALIER';

export interface CreatePayrunData {
  entrepriseId: number;
  periodeDebut: string; // ISO string
  periodeFin: string; // ISO string
  typePeriode: TypePeriode;
  statut?: StatutPayRun;
}

export async function createPayrun(data: CreatePayrunData) {
  return apiFetch("/payrun", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
