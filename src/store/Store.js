import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import projectReducer from '../features/projects/projectSlice'; 
import userReducer from '../features/users/userSlice'; // Import the user slice



export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: userReducer,

  },
});

export default store;
