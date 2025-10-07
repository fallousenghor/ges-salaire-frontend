import CreateCaissierPage from '../pages/CreateCaissierPage';
import CycleBulletinsPage from '../pages/CycleBulletinsPage';
import PayrunPage from "../pages/PayrunPage";
import PayslipPage from "../pages/PayslipPage";
import BultinPaix from "../pages/BultinPaix";
import DocumentsPage from "../pages/DocumentsPage";
import UtilisateursPage from "../pages/UtilisateursPage";

import PaiementPage from "../pages/PaiementPage";
import PaiementCaissierPage from "../pages/PaiementCaissierPage";


import LoginPage from "../pages/LoginPage";
import EmployeDetailsPage from "../pages/EmployeDetailsPage";
import EmployePage from "../pages/EmployePage";
import PointagePage from "../pages/PointagePage";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { DashboardPage } from "../pages/Dashboard";

// import { DashboardLayout } from "../layouts/DashboardLayout";

import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { RequireAuth } from './RequireAuth';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import Superadmin from "../pages/Superadmin";
import { getUser } from '../services/authService';
import { SuperAdminAccessPage } from '../pages/parametres/SuperAdminAccess';


function AppRoutesInner() {
  const location = useLocation();
  const user = getUser();

  // Si superadmin, il ne peut accéder qu'à /entreprises
  if (user?.role?.toLowerCase() === 'super_admin' || user?.role?.toLowerCase() === 'superadmin') {
    if (location.pathname !== '/entreprises') {
      return <Navigate to="/entreprises" replace />;
    }
    return (
      <Routes>
        <Route path="/entreprises" element={
          <RequireAuth>
            <SuperAdminLayout>
              <Superadmin />
            </SuperAdminLayout>
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/entreprises" replace />} />
      </Routes>
    );
  }

  // Si caissier, accès uniquement à la page de paiement (à restreindre plus tard)
  if (user?.role?.toLowerCase() === 'caissier') {
    if (location.pathname !== '/paiements') {
      return <Navigate to="/paiements" replace />;
    }
    return (
      <Routes>
        <Route path="/paiements" element={
          <RequireAuth>
            <DashboardLayout>
              <PaiementCaissierPage />
            </DashboardLayout>
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/paiements" replace />} />
      </Routes>
    );
  }

  // Pour les autres rôles, accès normal
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/changer-mot-de-passe" element={<ChangePasswordPage />} />
      <Route path="/dashboard" element={
        <RequireAuth>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/cycle-bulletins" element={
        <RequireAuth>
          <DashboardLayout>
            <CycleBulletinsPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/employes" element={
        <RequireAuth>
          <DashboardLayout>
            <EmployePage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/employes/:id" element={
        <RequireAuth>
          <DashboardLayout>
            <EmployeDetailsPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/pointage" element={
        <RequireAuth>
          <DashboardLayout>
            <PointagePage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/paiements" element={
        <RequireAuth>
          <DashboardLayout>
            <PaiementPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/payslips" element={
        <RequireAuth>
          <DashboardLayout>
            <PayslipPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/payruns" element={
        <RequireAuth>
          <DashboardLayout>
            <PayrunPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/cycles" element={
        <RequireAuth>
          <DashboardLayout>
            <PayrunPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/bulletins" element={
        <RequireAuth>
          <DashboardLayout>
            <BultinPaix />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/documents" element={
        <RequireAuth>
          <DashboardLayout>
            <DocumentsPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/utilisateurs" element={
        <RequireAuth>
          <DashboardLayout>
            <UtilisateursPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/creer-caissier" element={
        <RequireAuth>
          <DashboardLayout>
            <CreateCaissierPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/parametres/acces-super-admin" element={
        <RequireAuth>
          <DashboardLayout>
            <SuperAdminAccessPage />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/entreprises" element={
        <RequireAuth>
          <SuperAdminLayout>
            <Superadmin />
          </SuperAdminLayout>
        </RequireAuth>
      } />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesInner />
    </BrowserRouter>
  );
}
