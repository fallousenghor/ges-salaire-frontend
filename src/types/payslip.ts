import type { Employe } from "./employe";
import type { PayRun } from "./payrun";


export type StatutPayslip = 'EN_ATTENTE' | 'PARTIEL' | 'PAYE';

export interface Payslip {
  id: number;
  employe: Employe;
  employeId: number;
  payrun?: PayRun;
  payrunId?: number;
  brut?: number;
  deductions?: number;
  netAPayer: number;
  periode?: string;
  approuveAdmin: boolean;
  statut: StatutPayslip;
  createdAt: string;
  updatedAt: string;
}