
import { Sidebar, SuperAdminSidebar } from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { menuItems } from "../config/sidebarItems";
import { useAuth } from "../hooks/useAuth";
import type { DashboardLayoutProps } from "../types/propsType";


export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const activeItem =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.id ??
    "dashboard";

  const setActiveItem = (itemId: string) => {
    const found = menuItems.find((i) => i.id === itemId);
    if (found) navigate(found.path);
  };

  // RBAC : caissier n'a accès qu'aux paiements
  if (user?.role === 'CAISSIER') {
    // Rediriger si la route n'est pas /paiements
    if (!location.pathname.startsWith('/paiements')) {
      navigate('/paiements', { replace: true });
      return null;
    }
  }
  return (
    <div className="h-screen bg-theme-primary/5 flex">
      {user?.role === 'SUPER_ADMIN' ? (
        <SuperAdminSidebar isOpen={true} onClose={() => {}} />
      ) : (
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
