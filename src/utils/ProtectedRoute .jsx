// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, isPublic = false }) => {
  const { token } = useSelector((state) => state.auth); 

  if (isPublic && token) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isPublic && !token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
