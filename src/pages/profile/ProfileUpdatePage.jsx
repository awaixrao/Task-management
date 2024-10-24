// src/pages/ProfileUpdatePage.jsx
import React, { useEffect, useState } from 'react';
import { notification, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../features/profile/Profile'; // Import the new actions

const ProfileUpdatePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.profile); // Get user profile from profile state

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_active: true,
  });

  // Fetch user profile when the component mounts
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Load user data 
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        is_active: user.is_active,
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData)).then(() => {
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    });
  };

 
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Update Failed',
        description: error.message || 'An error occurred while updating your profile.',
      });
    }
  }, [error]);

  if (loading) {
    return <Spin size="large" />; 
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            
            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm font-semibold" htmlFor="is_active">
            Active
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdatePage;
