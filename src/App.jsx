// src/App.jsx
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import MainOutlet from './MainOutlet'; // Main layout
import DashboardPage from './pages/Home/HomePage'; // Dashboard content
import ProjectsPage from './pages/ProjectPage/ProjectPage.'; // Another page
import LoginPage from './pages/Login/LoginPage'; // Example login page
import SignupPage from './pages/Signup/SignupPage'; // Example login page

import ProtectedRoute from './utils/ProtectedRoute '
import UserManagementPage from './pages/userManagement/UserManagementPage';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<ProtectedRoute element={<LoginPage />} isPublic={true} />} />
      <Route path="signup" element={<ProtectedRoute element={<SignupPage />} isPublic={true} />} />

      {/* Routes that use MainOutlet for common layout */}
      <Route path="/"  element={<ProtectedRoute element={<MainOutlet />}/>}>
        <Route path="dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="projects" element={<ProtectedRoute element={<ProjectsPage />} />} />
        <Route path="users" element={<ProtectedRoute element={<UserManagementPage />} />} />

      </Route>
    </Routes>
  );
};

export default App;
