// src/lib/store/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  setLocalStorageWithExpiration,
  removeLocalStorageItem,
} from '@/lib/helper/storage';

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

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      // Use the helper function to store with expiration
      //setLocalStorageWithExpiration('token', action.payload.token, 1);
      //setLocalStorageWithExpiration('user', action.payload.user, 1);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;

      // Use helper function to remove items
      //removeLocalStorageItem('token');
      //removeLocalStorageItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
