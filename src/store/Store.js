// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import projectReducer from '../features/projects/projectSlice'; 
import userReducer from '../features/users/userSlice';
import profileReducer from '../features/profile/Profile'; 
import userProjectReducer from '../features/projects/userProjectSlice'; 
import taskReducer from '../features/tasks/taskSlice'; 
import commentReducer from '../features/comments/commentSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: userReducer,
    profile: profileReducer,
    userProjects: userProjectReducer,
    tasks: taskReducer,
    comments: commentReducer,
  },
});

export default store;
