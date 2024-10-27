import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(user));

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

      return { message: 'Registration successful!' };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Registration failed. Please try again.' }
      );
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('userRole') || null,
  loading: false,
  error: null,
  signupSuccess: false, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
    clearSignupSuccess: (state) => {
      state.signupSuccess = false;
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
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.signupSuccess = true; 
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.signupSuccess = false;
      });
  },
});

export const { logout, clearError, setUserRole, clearSignupSuccess } = authSlice.actions;

export default authSlice.reducer;
