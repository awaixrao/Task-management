// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define API base URL in a separate constant
const API_URL = 'https://task-manager.codionslab.com/api/v1';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const { token, user } = response.data.data;

      if (!token) {
        throw new Error('Token not found in response');
      }

      // Store token and user role in localStorage for session persistence
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role); // Store user role
      localStorage.setItem('user', JSON.stringify(user)); // Store user data

      // Return user, token, and role for updating Redux state
      return { user, token, role: user.role };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Login failed. Please try again.' }
      );
    }
  }
);

// Async thunk for user signup
export const register = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const { token, user } = response.data.data;

      // Store token and user data in localStorage for session persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user data
      localStorage.setItem('userRole', user.role); // Store user role

      return { user, token, role: user.role }; // Return user info and role
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Registration failed. Please try again.' }
      );
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Load user from localStorage
  token: localStorage.getItem('token') || null, // Load token from localStorage
  role: localStorage.getItem('userRole') || null, // Load role from localStorage
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
    clearError: (state) => {
      state.error = null; // Clear error message
    },
    setUserRole: (state, action) => {
      state.role = action.payload; // Update role in the state
      localStorage.setItem('userRole', action.payload); // Also update localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading to true during API call
        state.error = null; // Clear previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false after success
        state.user = action.payload.user; // Update user in state
        state.token = action.payload.token; // Update token in state
        state.role = action.payload.role; // Update role in state
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user)); 
        localStorage.setItem('userRole', action.payload.role); // Store role in localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Set error message
      })
      .addCase(register.pending, (state) => {
        state.loading = true; // Set loading to true during API call
        state.error = null; // Clear previous errors
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false after success
        state.user = action.payload.user; // Update user in state
        state.token = action.payload.token; // Update token in state
        state.role = action.payload.role; // Update role in state
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user)); 
        localStorage.setItem('userRole', action.payload.role); // Store role in localStorage
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Set error message
      });
  },
});

// Export actions for use in components
export const { logout, clearError, setUserRole } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
