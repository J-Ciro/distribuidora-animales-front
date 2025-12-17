import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminUser } from '../../../utils/auth';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdminUser(user)) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

