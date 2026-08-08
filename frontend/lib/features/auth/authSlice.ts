import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

// Define the User type based on backend
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const loadAuthState = () => {
  try {
    if (typeof window !== 'undefined') {
      const serializedUser = localStorage.getItem('user');
      if (serializedUser === null) return undefined;
      return JSON.parse(serializedUser);
    }
  } catch (err) {
    return undefined;
  }
};

const savedUser = loadAuthState();

const initialState: AuthState = {
  user: savedUser || null,
  isAuthenticated: !!savedUser,
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // Assumes backend returns user info directly or inside an object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me'); // Assuming an endpoint that returns the current user
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      const userData = action.payload.user || action.payload;
      state.user = userData;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      const userData = action.payload.user || action.payload;
      state.user = userData;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    });

    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      const userData = action.payload.user || action.payload;
      state.user = userData;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
