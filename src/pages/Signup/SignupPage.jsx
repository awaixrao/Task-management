// src/pages/SignupPage.js

import React, { useEffect } from 'react';
import BackgroundImage from '../../components/common/BackgroundIamge';
import SignUpForm from '../../components/SigunpForm'; 
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/AuthSlice'; 
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSignUp = (values) => {
    dispatch(register(values));
  };

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Signup failed. Please try again.');
    }
    if (user) {
      message.success('Signup successful! Redirecting to login...');
      navigate('/login'); // Redirect to login after successful signup
    }
  }, [error, user, navigate]);

  return (
    <div className="flex h-screen">
      <BackgroundImage />
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <SignUpForm onSignUp={handleSignUp} loading={loading} />
      </div>
    </div>
  );
};

export default SignupPage;
