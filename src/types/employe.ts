import type { StatutEmploye, TypeContrat } from './shared';
import type { Entreprise } from './entreprise';


export interface Badge {
  id: number;
  employeId: number;
  matricule: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employe {
  id: number;
  entreprise: Entreprise;
  nomComplet: string;
  poste?: string;
  typeContrat: TypeContrat;
  salaireFixe?: number;
  tauxJournalier?: number;
  honoraire?: number;
  coordonneesBancaires?: string;
  statut: StatutEmploye;
  actif: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  badge?: Badge;
}