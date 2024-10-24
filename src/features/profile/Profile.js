// src/features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1/profile';

// Fetch user profile
export const fetchUserProfile = createAsyncThunk('profile/fetchUserProfile', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.token;

  if (!token) {
    return rejectWithValue({ message: 'No token provided' });
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch profile' });
  }
});

// Update user profile
export const updateUserProfile = createAsyncThunk('profile/updateUserProfile', async (userData, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.token;

  if (!token) {
    return rejectWithValue({ message: 'No token provided' });
  }

  try {
    const response = await axios.post(API_URL, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
  }
});

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = profileSlice.actions;

export default profileSlice.reducer;
