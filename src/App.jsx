// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { AuthProvider, useAuth } from './AuthProvider';
import { TenantProvider, useTenant } from './TenantProvider';
import RequireAuth from './components/RequireAuth';
import PasswordReset from './components/PasswordReset';
import ServiceListScreen from './components/ServiceListScreen';
import ServiceSummaryScreen from './components/ServiceSummaryScreen';
import StylistSelectionScreen from './components/StylistSelectionScreen';
import ProfessionalCalendarScreen from './components/ProfessionalCalendarScreen';
import MyAppointmentsScreen from './components/MyAppointmentsScreen';
import MyProfileScreen from './components/MyProfileScreen';
import AdminRouter from './routes/AdminRouter';
import Login from './components/Login';
import Landing from './components/Landing';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/:tenant/*"
            element={
              <TenantProvider>
                <AppContent />
              </TenantProvider>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, profile } = useAuth();
  const location         = useLocation();
  const { slug, projectName, companyId } = useTenant();
  // usados para mostrar/ocultar el panel admin
  const isTenantAdmin    =
    profile?.isAdmin === true && profile?.companyId === companyId;

  const menuItem =
    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap";

  return (
    <>
      <header className="p-4 bg-white shadow flex flex-wrap justify-between items-center gap-2">
        <Link to={`/${slug}`} className="text-xl font-bold">{projectName}</Link>
        <div className="flex flex-wrap items-center gap-2">
          {user ? (
            <details className="relative dropdown">
              <summary className="cursor-pointer px-3 py-1 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100">
                Menú
              </summary>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col z-10">
                <Link to={`/${slug}/mis-turnos`} className={menuItem}>Mis Turnos</Link>
                <Link to={`/${slug}/mi-perfil`} className={menuItem}>Mi Perfil</Link>
                {isTenantAdmin && (
                  <Link to={`/${slug}/admin`} className={menuItem}>Panel Admin</Link>
                )}
                <button onClick={() => signOut(auth)} className={menuItem}>Logout</button>
              </div>
            </details>
          ) : (
            <Link to={`/${slug}/login`} className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100">Login</Link>
          )}
        </div>
      </header>

      <main className="p-4">
        <Routes>
          <Route index element={<ServiceListScreen />} />
          <Route path="summary" element={<ServiceSummaryScreen />} />
          <Route path="stylists" element={<StylistSelectionScreen />} />

          <Route
            path="login"
            element={user ? <Navigate to="" replace /> : <Login />}
          />

          <Route path="reset-password" element={<PasswordReset />} />

          <Route
            path="professional"
            element={
              <RequireAuth>
                <ProfessionalCalendarScreen />
              </RequireAuth>
            }
          />

          <Route
            path="mis-turnos"
            element={
              <RequireAuth>
                <MyAppointmentsScreen />
              </RequireAuth>
            }
          />

          <Route
            path="mi-perfil"
            element={
              <RequireAuth>
                <MyProfileScreen />
              </RequireAuth>
            }
          />

          <Route
            path="admin/*"
            element={
              <RequireAuth>
                {isTenantAdmin ? (
                  <AdminRouter />
                ) : (
                  <Navigate to="" replace />
                )}
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </>
  );
}
