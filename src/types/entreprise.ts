import type { User } from "../context/AuthContextOnly";
import type { TypePeriode } from "./shared";

export interface EntrepriseFormData extends Omit<Entreprise, 'logo'> {
  logo?: string | File;
}

export interface Entreprise {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  logo?: string;
  devise: string;
  typePeriode: TypePeriode;
  statut?: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  users?: User[];
  createdAt?: string;
  updatedAt?: string;
  createurId?: number;
  superAdminAccess?: Array<{
    superAdminId: number;
    entrepriseId: number;
    hasAccess: boolean;
    createdAt: string;
    updatedAt: string;
    superAdmin: {
      user: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
      }
    }
  }>;
}
