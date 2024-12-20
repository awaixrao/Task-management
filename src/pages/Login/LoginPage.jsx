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
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (userData) => {
    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      const redirectPath = location.state?.from || '/dashboard'; 
      navigate(redirectPath);
    }
  };

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Login failed. Please try again.');
    }
  }, [error]);

  return (
    <div className="flex  h-screen">
      <BackgroundImage />
      <div className="w-full md:w-1/2 bg-slate-200 flex items-center justify-center p-4">
        <div className="w-full  max-w-xs sm:max-w-sm    rounded-lg shadow-lg">
          <LoginForm onFinish={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
