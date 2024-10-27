// src/App.jsx
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import MainOutlet from './MainOutlet'; 
import DashboardPage from './pages/Home/HomePage'; 
import ProjectsPage from './pages/ProjectPage/ProjectPage.'; 
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage'; 

import ProtectedRoute from './utils/ProtectedRoute '
import UserManagementPage from './pages/userManagement/UserManagementPage';
import ProfileUpdatePage from './pages/profile/ProfileUpdatePage';
import TasksPage from './pages/Tasks/TasksPage';
import CommentsPage from './pages/comments/CommentPage';

const App = () => {

  return (

   
    
    <Routes>
      {/* Public routes */}

      <Route path="login" element={<ProtectedRoute element={<LoginPage />} isPublic={true} />} />
      <Route path="signup" element={<ProtectedRoute element={<SignupPage />} isPublic={true} />} />



      <Route path="/"  element={<ProtectedRoute element={<MainOutlet />}/>}>
        <Route path="dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="projects" element={<ProtectedRoute element={<ProjectsPage />} />} />
        <Route path="users" element={<ProtectedRoute element={<UserManagementPage />} />} />
        <Route path="profile" element={<ProtectedRoute element={<ProfileUpdatePage />} />} />
        <Route path="tasks/:id?" element={<ProtectedRoute element={<TasksPage />} />} />
        <Route path="projects/:projectId/tasks/:taskId/comments" element={<ProtectedRoute element={<CommentsPage />} />} />
        </Route>
    </Routes>
  );
};

export default App;
