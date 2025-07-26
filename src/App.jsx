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

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={`/${slug}`}>{projectName}</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={`/${slug}/mis-turnos`}>Mis Turnos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={`/${slug}/mi-perfil`}>Mi Perfil</Link>
                  </li>
                  {isTenantAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to={`/${slug}/admin`}>Panel Admin</Link>
                    </li>
                  )}
                </>
              )}
              {user ? (
                <li className="nav-item">
                  <button onClick={() => signOut(auth)} className="nav-link btn btn-link">Logout</button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to={`/${slug}/login`}>Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="p-2">
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
