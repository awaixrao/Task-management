// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1/admin/user';

// Fetch users with pagination
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue({ message: 'No token provided' });
    }

    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return {
        users: response.data.data.data,
        total: response.data.data.total,
        currentPage: page,
        pageSize: limit,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An unknown error occurred' });
    }
  }
);

// Create a user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { getState, rejectWithValue }) => {
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
      return rejectWithValue(error.response?.data || { message: 'Failed to create user' });
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue({ message: 'No token provided' });
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update user' });
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue({ message: 'No token provided' });
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete user' });
    }
  }
);

// Initial state
const initialState = {
  users: [],
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user => (user.id === action.payload.id ? action.payload : user));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
