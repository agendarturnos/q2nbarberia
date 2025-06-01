import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (!auth.currentUser) {
    // guardamos la ruta completa (pathname + state) en from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
