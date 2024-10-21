// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, isPublic = false }) => {
  const { token } = useSelector((state) => state.auth); // Get the token from Redux state

  // If the route is public and the user is logged in, redirect to the dashboard
  if (isPublic && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the route is private and the user is not logged in, redirect to the login page
  if (!isPublic && !token) {
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, return the element
  return element;
};

export default ProtectedRoute;
