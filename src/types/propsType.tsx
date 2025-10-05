import type { JSX, ReactNode } from "react";

export interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: JSX.Element;
  color?: 'green' | 'blue' | 'orange' | 'purple';
  isLoading?: boolean;
}

export interface DashboardLayoutProps {
  children: ReactNode;
}


export interface CompanyFormProps {
  entrepriseId?: string; 
  onSuccess?: () => void; 
}

export type SuperAdminNavbarProps = {
  onMenuToggle: () => void;
};

export type SuperAdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};
