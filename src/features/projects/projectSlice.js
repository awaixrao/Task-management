// src/features/projects/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1/admin/project';

// Async thunk for fetching projects with pagination
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ page = 1, limit = 10, userId }, { rejectWithValue }) => {
    try {
      const url = userId 
        ? `${API_URL}/user/${userId}?page=${page}&limit=${limit}` 
        : `${API_URL}?page=${page}&limit=${limit}`;
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return {
        projects: response.data.data.data,
        total: response.data.data.total,
        currentPage: page,
        pageSize: limit,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An unknown error occurred' });
    }
  }
);

// Fetch user-assigned projects
export const fetchUserProjects = createAsyncThunk(
  'projects/fetchUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch assigned projects' });
    }
  }
);

// Async thunk for creating a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, projectData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Ensure this matches the expected structure
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create project' });
    }
  }
);

// Async thunk for updating an existing project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    // Validate required fields
    const { name, description, is_active } = projectData;
    if (!name) return rejectWithValue({ message: 'The name field is required.' });
    if (!description) return rejectWithValue({ message: 'The description field is required.' });
    if (typeof is_active !== 'boolean') return rejectWithValue({ message: 'The is_active field must be a boolean.' });

    try {
      const response = await axios.put(`${API_URL}/${id}`, projectData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Ensure this matches the expected structure
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update project' });
    }
  }
);

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return id; // Return the id of the deleted project for filtering
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete project' });
    }
  }
);

// Async thunk for assigning users to a project
export const assignUsersToProject = createAsyncThunk(
  'projects/assignUsers',
  async ({ projectId, userIds }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/assign`, {
        user_ids: userIds,
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Ensure this matches the expected structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to assign users to project.' }
      );
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  totalProjects: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear error when called
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProjects actions
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.totalProjects = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle createProject actions
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload); // Add new project to the state
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateProject actions
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteProject actions
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle assignUsers actions
      .addCase(assignUsersToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignUsersToProject.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can update state here based on your API response
        console.log('Users assigned:', action.payload);
      })
      .addCase(assignUsersToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the action to clear errors
export const { clearError } = projectSlice.actions;

// Export the reducer
export default projectSlice.reducer;
