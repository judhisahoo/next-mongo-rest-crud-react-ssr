// src/lib/store/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  dob: Date;
  status: boolean;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

// The initial state is now a static, unauthenticated state.
// Reading from localStorage here is the cause of the hydration error.
const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;

      const now = new Date();
      const expiry = now.getTime() + 60 * 60 * 1000; // 1 hour expiration
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'token',
          JSON.stringify({ value: action.payload.token, expiry }),
        );
        localStorage.setItem(
          'user',
          JSON.stringify({ value: action.payload.user, expiry }),
        );
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
