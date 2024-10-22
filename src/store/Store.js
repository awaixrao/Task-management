import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import projectReducer from '../features/projects/projectSlice'; 
import userReducer from '../features/users/userSlice'; // Import the user slice
import profileReducer from '../features/profile/Profile'; // Import the user slice
import userProjectReducer from '../features/projects/userProjectSlice'; // Import the new reducer





export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: userReducer,
    profile: profileReducer, // Add the profile reducer here
    userProjects: userProjectReducer, // Add the user project reducer here



  },
});

export default store;
