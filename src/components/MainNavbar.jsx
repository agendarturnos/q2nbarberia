import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../AuthProvider';
import { useTenant } from '../TenantProvider';

export default function MainNavbar() {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();
  const { slug, projectName, companyId } = useTenant();
  const isTenantAdmin = profile?.isAdmin === true && profile?.companyId === companyId;

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);
  const collapseClass = `navbar-collapse ${open ? 'show' : 'collapse'}`;

  return (
    <nav className="navbar navbar-dark bg-primary navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to={`/${slug}`} onClick={close}>{projectName}</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNavbar"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={collapseClass} id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={`/${slug}/mis-turnos`} onClick={close}>Mis Turnos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/${slug}/mi-perfil`} onClick={close}>Mi Perfil</Link>
                </li>
                {isTenantAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to={`/${slug}/admin`} onClick={close}>Panel Admin</Link>
                  </li>
                )}
              </>
            )}
            {user ? (
              <li className="nav-item">
                <button onClick={() => { signOut(auth); close(); }} className="nav-link btn btn-link">Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to={`/${slug}/login`} onClick={close}>Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
