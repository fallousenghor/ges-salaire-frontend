/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getNbPointages(employeId: number, start: string, end: string): Promise<number> {
  return apiFetch(`/employe/${employeId}/pointages?start=${start}&end=${end}`);
}
export async function getLastPointage(employeId: number): Promise<{ date: string } | null> {
  return apiFetch(`/employe/${employeId}/last-pointage`);
}
import { apiFetch } from "../api/apiFetch";


export async function pointerEmploye(employeId: number): Promise<any> {
  return apiFetch(`/employe/${employeId}/pointer`, {
    method: "POST"
  });
}
