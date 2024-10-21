// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth); // Access token from auth state

  // If the user is not authenticated, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;
