// src/pages/LoginPage.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/AuthSlice';
import LoginForm from '../../components/LoginForm';
import BackgroundImage from '../../components/common/BackgroundIamge';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (userData) => {
    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      // If login is successful, navigate to the originally intended page
      const redirectPath = location.state?.from || '/dashboard'; // Use the original location or default to dashboard
      navigate(redirectPath);
    }
  };

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Login failed. Please try again.');
    }
  }, [error]);

  return (
    <div className="flex h-screen">
      <BackgroundImage />
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <LoginForm onFinish={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default LoginPage;
