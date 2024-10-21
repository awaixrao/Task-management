import axios from 'axios';
import store from '../store/Store'; // Import the Redux store
import { logout } from '../features/auth/AuthSlice'; // Import the logout action
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://task-manager.codionslab.com/api/v1';

// Create an instance of Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Aapi.interceptors.request.use(
  (config) => {
    console.log("Interceptor Request:", config);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Interceptor Request Error:", error);
    return Promise.reject(error);
  }


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor Response Error:", error);
    if (error.response && error.response.status === 401) {
      store.dispatch(logout()); // Ensure store is initialized before dispatch
      window.location.href = '/login'; // Use navigation logic that doesn't affect store init
    }
    return Promise.reject(error);
  }
);



export default api;
