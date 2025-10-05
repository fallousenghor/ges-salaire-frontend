import { createContext } from "react";
export interface Role {
  id: number;
  userId: number;
  entrepriseId?: number;
  role: string;
}

export interface User {
  id: string;
  email: string;
  role: "superadmin" | "admin" | "caissier";
  entrepriseId?: number;
  roles?: Role[];
}


export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
