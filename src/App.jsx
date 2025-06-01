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
import RequireAuth from './components/RequireAuth';
import PasswordReset from './components/PasswordReset';
import ServiceListScreen from './components/ServiceListScreen';
import ServiceSummaryScreen from './components/ServiceSummaryScreen';
import StylistSelectionScreen from './components/StylistSelectionScreen';
import ProfessionalCalendarScreen from './components/ProfessionalCalendarScreen';
import MyAppointmentsScreen from './components/MyAppointmentsScreen';
import AdminRouter from './routes/AdminRouter';
import Login from './components/Login';

const projectName = String(import.meta.env.VITE_PROJECT_NAME || 'Mi Aplicación');
const COMPANY_ID  = import.meta.env.VITE_COMPANY_ID;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, profile } = useAuth();
  const location         = useLocation();
  // usados para mostrar/ocultar el panel admin
  const isTenantAdmin    =
    profile?.isAdmin === true && profile?.companyId === COMPANY_ID;

  const baseBtn =
    "px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 transition";

  return (
    <>
      <header className="p-4 bg-gray-100 flex flex-wrap justify-between items-center gap-2">
        <Link to="/" className="text-xl font-bold">{projectName}</Link>
        <div className="flex flex-wrap items-center gap-2">
          {user && (
            <>
              <Link to="/mis-turnos" className={baseBtn}>Mis Turnos</Link>
              {isTenantAdmin && (
                <Link to="/admin" className={baseBtn}>Panel Admin</Link>
              )}
            </>
          )}
          {user ? (
            <button
              onClick={() => signOut(auth)}
              className={baseBtn}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={baseBtn}>Login</Link>
          )}
        </div>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<ServiceListScreen />} />
          <Route path="/summary" element={<ServiceSummaryScreen />} />
          <Route path="/stylists" element={<StylistSelectionScreen />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          <Route path="/reset-password" element={<PasswordReset />} />

          <Route
            path="/professional"
            element={
              <RequireAuth>
                <ProfessionalCalendarScreen />
              </RequireAuth>
            }
          />

          <Route
            path="/mis-turnos"
            element={
              <RequireAuth>
                <MyAppointmentsScreen />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                {isTenantAdmin ? (
                  <AdminRouter />
                ) : (
                  <Navigate to="/" replace />
                )}
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
