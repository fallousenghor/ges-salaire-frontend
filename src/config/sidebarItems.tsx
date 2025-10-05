
import { BarChart3, Building2, Users, Calendar, FileStack, UserCog, Settings, LogOut } from "lucide-react";


import { messagesFr } from '../utils/message.fr';

export const menuItems = [
  { id: 'dashboard', icon: BarChart3, label: messagesFr.tableauBord, active: true, path: '/dashboard' },
  { id: 'employees', icon: Users, label: messagesFr.employes, path: '/employes' },
  { id: 'pointage', icon: Calendar, label: 'Pointage', path: '/pointage' },
  { id: 'cycle-bulletins', icon: Calendar, label: 'Cycles de paie', path: '/cycle-bulletins' },
  { id: 'payslips', icon: FileStack, label: 'Bulletins de salaire', path: '/bulletins' },
  { id: 'documents', icon: FileStack, label: messagesFr.documentsPdf, path: '/documents' },
  { id: 'users', icon: UserCog, label: messagesFr.utilisateursRoles, path: '/utilisateurs' },
  { id: 'create-caissier', icon: UserCog, label: 'Créer un caissier', path: '/creer-caissier' },
];


export const generalItems = [
  { id: 'settings', icon: Settings, label: messagesFr.parametres },
  { id: 'logout', icon: LogOut, label: messagesFr.deconnexion }
];
 

export const menuItemsuperAdmin = [
  { id: 'companies', icon: Building2, label: 'Gestion Entreprises' },
];