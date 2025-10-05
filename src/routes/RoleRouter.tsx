import { Navigate } from 'react-router-dom';
import { getUser } from '../services/authService';
import Superadmin from '../pages/Superadmin';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import Caissier from '../pages/Caissier';
import { DashboardPage } from '../pages/Dashboard';


export function RoleRouter() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'SUPER_ADMIN') {
    return (
      <SuperAdminLayout>
        <Superadmin />
      </SuperAdminLayout>
    );
  }
  if (user.role === 'ADMIN') {
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    );
  }
  if (user.role === 'CAISSIER') return <Caissier />;
  return <DashboardPage />;
}
