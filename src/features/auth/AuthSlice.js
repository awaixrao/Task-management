// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const { token, user } = response.data.data;

      if (!token) {
        throw new Error('Token not found in response');
      }

      // Store token and user role in localStorage for session persistence
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role); // Store role
      localStorage.setItem('user', JSON.stringify(user)); // Store user data

      // Return user, token, and role for updating Redux state
      return { user, token, role: user.role };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'An unknown error occurred' }
      );
    }
  }
);

// Async thunk for signup
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

      return { user, token, role: user.role }; // Return role as well
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'An unknown error occurred' }
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
      localStorage.removeItem('token'); // Clear token from localStorage
      localStorage.removeItem('user'); // Clear user from localStorage
      localStorage.removeItem('userRole'); // Clear user role from localStorage
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserRole: (state, action) => {
      state.role = action.payload; // Update role in the state
      localStorage.setItem('userRole', action.payload); // Also update localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role; // Set role from payload
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user in localStorage
        localStorage.setItem('userRole', action.payload.role); // Store role in localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role; // Set role from payload
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user in localStorage
        localStorage.setItem('userRole', action.payload.role); // Store role in localStorage
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout, clearError, setUserRole } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
