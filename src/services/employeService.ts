import type { Employe } from "../types/employe";
import { apiFetch } from "../api/apiFetch";

export async function createEmploye(
  employeData: Omit<Employe, "id" | "entreprise" | "badge" | "createdAt" | "updatedAt"> & { entrepriseId: number }
) {
  const res = await apiFetch(`/employe`, {
    method: "POST",
    body: JSON.stringify(employeData),
  });
  return res.data;
}

export async function fetchEmployes(entrepriseId: number): Promise<Employe[]> {
  const res = await apiFetch(`/employe/entreprise/${entrepriseId}`);
  return res;
}
