// src/App.jsx
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (window.M && window.M.AutoInit) {
      window.M.AutoInit();
    }
  }, []);


  return (
    <>
      <nav className="teal">
        <div className="nav-wrapper container">
          <Link to={`/${slug}`} className="brand-logo">
            {projectName}
          </Link>
          {user ? (
            <>
              <a href="#" className="dropdown-trigger right" data-target="user-dropdown">
                Menú <i className="material-icons right">arrow_drop_down</i>
              </a>
              <ul id="user-dropdown" className="dropdown-content">
                <li><Link to={`/${slug}/mis-turnos`}>Mis Turnos</Link></li>
                <li><Link to={`/${slug}/mi-perfil`}>Mi Perfil</Link></li>
                {isTenantAdmin && (
                  <li><Link to={`/${slug}/admin`}>Panel Admin</Link></li>
                )}
                <li><a href="#" onClick={() => signOut(auth)}>Logout</a></li>
              </ul>
            </>
          ) : (
            <Link to={`/${slug}/login`} className="right btn-flat white-text">Login</Link>
          )}
        </div>
      </nav>

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
