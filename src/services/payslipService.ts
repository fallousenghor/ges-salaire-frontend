import { apiFetch } from "../api/apiFetch";
import type { StatutPayslip } from "../types/shared";
import type { Payslip } from "../types/payslip";

export interface CreatePayslipData {
  employeId: number;
  payrunId: number;
  brut: number;
  deductions?: number;
  netAPayer: number;
  statut?: StatutPayslip;
  verrouille?: boolean;
}

export async function createPayslip(data: CreatePayslipData): Promise<Payslip> {
  return apiFetch("/payslip", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getPayslipsByEmploye(employeId: number): Promise<Payslip[]> {
  return apiFetch(`/payslip/employe/${employeId}`);
}

export async function downloadPayslipPDF(payslipId: number): Promise<void> {
  const response = await fetch(`/api/payslip/${payslipId}/pdf`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Erreur lors du téléchargement du PDF');
  
  // Crée un blob à partir de la réponse
  const blob = await response.blob();
  // Crée une URL pour le blob
  const url = window.URL.createObjectURL(blob);
  // Crée un élément a
  const a = document.createElement('a');
  a.href = url;
  a.download = `bulletin-${payslipId}.pdf`;
  // Simule un clic
  document.body.appendChild(a);
  a.click();
  // Nettoie
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
