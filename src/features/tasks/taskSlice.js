import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_URL = 'https://task-manager.codionslab.com/api/v1/project';

// Async thunk for fetching tasks for a project
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/task`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data; // Assuming the tasks are in response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch tasks' });
    }
  }
);

// Async thunk for creating a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/task`, taskData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Assuming the new task is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create task' });
    }
  }
);

// Async thunk for fetching a specific task by ID
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Assuming the task data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch task' });
    }
  }
);

// Async thunk for updating an existing task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${projectId}/task/${taskId}`, taskData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Assuming the updated task is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update task' });
    }
  }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      console.log('Project ID:', projectId, 'Task ID:', taskId);  // Log the IDs before making the request
      await axios.delete(`${API_URL}/${projectId}/task/${taskId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return taskId; // Return the taskId to remove from the state
    } catch (error) {
      console.error('Delete Task Error:', error.response); // Log the error response
      return rejectWithValue(error.response?.data || { message: 'Failed to delete task' });
    }
  }
);



// Async thunk for assigning users to a task
export const assignUsersToTask = createAsyncThunk(
  'tasks/assignUsersToTask',
  async ({ projectId, taskId, userIds }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/task/${taskId}/assign`, {
        user_ids: userIds,
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data; // Assuming assigned users data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to assign users to task' });
    }
  }
);

// Initial state
const initialState = {
  tasks: [],  // List of tasks
  loading: false, // To handle loading state
  error: null,    // To store error messages
};

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear any existing error
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data; // Assuming the fetched tasks are in action.payload.data
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // Add the newly created task
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchTaskById (can be used to edit task or display detailed task view)
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        // You can update a specific task in the state here if needed
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ); // Update the task in the state
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle assignUsersToTask
      .addCase(assignUsersToTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignUsersToTask.fulfilled, (state, action) => {
        state.loading = false;
        // Handle assigning users to the task if needed
      })
      .addCase(assignUsersToTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the action to clear errors
export const { clearError } = taskSlice.actions;

// Export the reducer
export default taskSlice.reducer;
