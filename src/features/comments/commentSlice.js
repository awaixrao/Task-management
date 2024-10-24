// src/features/comments/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://task-manager.codionslab.com/api/v1/project';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/task/${taskId}/comment`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch comments' });
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ projectId, taskId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/task/${taskId}/comment`, commentData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add comment' });
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ projectId, taskId, commentId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${projectId}/task/${taskId}/comment/${commentId}`, commentData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update comment' });
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ projectId, taskId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${projectId}/task/${taskId}/comment/${commentId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete comment' });
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((comment) => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = commentSlice.actions;

export default commentSlice.reducer;
