import { apiFetch } from "../api/apiFetch";
import { emit } from "../utils/eventBus";

// Types alignés sur le backend
export type ModePaiement = 'ESPECES' | 'VIREMENT' | 'ORANGE_MONEY' | 'WAVE' | 'AUTRE';

export interface PaiementPayslipData {
  payslipId: number;
  montant: number;
  mode: ModePaiement;
  datePaiement?: string; // ISO string
  pdfRecu?: string;
}

export async function payerPayslip(data: PaiementPayslipData) {
  const res = await apiFetch("/paiement", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // Emit an event so other parts of the app can react (e.g. dashboard)
  try {
    // Try to extract montant and payslipId from the response, fallback to request data
    const montant = (res && (res.montant ?? res.data?.montant)) ?? data.montant;
    const payslipId = (res && (res.payslipId ?? res.data?.payslipId)) ?? data.payslipId;
    emit('paiement:created', { montant, payslipId, raw: res });
  } catch {
    // no-op
  }
  return res;
}
