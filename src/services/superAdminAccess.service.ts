import type { AxiosResponse } from 'axios';
import api from '../api/axios';

interface SwitchToAdminResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    entrepriseId: number;
  };
}

export interface SuperAdminAccess {
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
}

export interface Entreprise {
  id: number;
  nom: string;
  telephone: string;
  adresse: string;
  email: string;
  logo: string | null;
  description: string | null;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  statut: string;
}

export const superAdminAccessService = {
  grantAccess: async (superAdminId: number, entrepriseId: number, hasAccess: boolean): Promise<AxiosResponse> => {
    return api.post('/super-admin-access/grant-access', {
      superAdminId,
      entrepriseId,
      hasAccess
    });
  },

  getAccessList: async (entrepriseId: number): Promise<SuperAdminAccess[]> => {
    const response = await api.get(`/super-admin-access/${entrepriseId}`);
    return response.data;
  },

  switchToAdmin: async (entrepriseId: number): Promise<AxiosResponse<SwitchToAdminResponse>> => {
    return api.post(`/auth/switch-to-admin/${entrepriseId}`);
  },

  inviteSuperAdmin: async (entrepriseId: number, email: string): Promise<AxiosResponse> => {
    return api.post('/super-admin-access/invite', {
      entrepriseId,
      email
    });
  },

  getMainSuperAdmin: async (): Promise<{id: number; nom: string; prenom: string; email: string}> => {
    const response = await api.get('/super-admin/main');
    return response.data;
  }
};