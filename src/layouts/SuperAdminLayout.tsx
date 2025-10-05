


import type { ReactNode } from 'react';
import { SuperAdminNavbar } from '../components/Navbar';
import { SuperAdminSidebar } from '../components/Sidebar';

type SuperAdminLayoutProps = {
  children: ReactNode;
};

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="flex h-screen bg-blue-50">
      <SuperAdminSidebar isOpen={true} onClose={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminNavbar onMenuToggle={() => {}} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
