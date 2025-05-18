import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the required permissions
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission(permission));

  if (!hasRequiredPermission) {
    // Redirect to unauthorized page if user doesn't have required permissions
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 