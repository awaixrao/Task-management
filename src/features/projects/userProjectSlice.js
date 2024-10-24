// src/features/projects/userProjectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1/project';

// Fetch user-specific projects
export const fetchUserProjects = createAsyncThunk(
  'userProjects/fetchUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch assigned projects' }
      );
    }
  }
);

// Create the user project slice
const userProjectSlice = createSlice({
  name: 'userProjects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.projects = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch projects';
        state.loading = false;
      });
  },
});

export const { clearError } = userProjectSlice.actions;

export default userProjectSlice.reducer;
