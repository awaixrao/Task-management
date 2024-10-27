import React, { useEffect } from 'react';
import BackgroundImage from '../../components/common/BackgroundIamge';
import SignUpForm from '../../components/SigunpForm'; 
import { useDispatch, useSelector } from 'react-redux';
import { register, clearSignupSuccess } from '../../features/auth/AuthSlice'; 
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, signupSuccess } = useSelector((state) => state.auth);

  const handleSignUp = (values) => {
    dispatch(register(values));
  };

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Signup failed. Please try again.');
    }
    if (signupSuccess) {
      message.success('Signup successful! Redirecting to login...');
      navigate('/login'); 
      dispatch(clearSignupSuccess());
    }
  }, [error, signupSuccess, navigate, dispatch]);

  return (
    <div className="flex h-screen">
      <BackgroundImage />
      <div className="w-full md:w-1/2 flex  bg-slate-200  items-center justify-center p-4">
        <SignUpForm onSignUp={handleSignUp} loading={loading} />
      </div>
    </div>
  );
};

export default SignupPage;
