import axios from 'axios';
import { logout } from '../features/auth/AuthSlice'; 

const API_URL = 'https://task-manager.codionslab.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    console.log("Interceptor Request:", config); 
    return config;
  },
  (error) => {
    console.log("Interceptor Request Error:", error); 
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Interceptor Response Error:", error); 
    if (error.response && error.response.status === 401) {
      store.dispatch(logout()); 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
