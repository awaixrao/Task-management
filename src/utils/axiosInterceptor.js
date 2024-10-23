import axios from 'axios';
import { logout } from '../features/auth/AuthSlice'; // Import the logout action

const API_URL = 'https://task-manager.codionslab.com/api/v1';

// Create an instance of Axios
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
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }
    console.log("Interceptor Request:", config); // Optional: Log the config
    return config;
  },
  (error) => {
    console.log("Interceptor Request Error:", error); // Optional: Log the error
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Interceptor Response Error:", error); // Optional: Log the error
    if (error.response && error.response.status === 401) {
      store.dispatch(logout()); // Dispatch logout action
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
