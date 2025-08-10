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

const getInitialAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const tokenItem = localStorage.getItem('token');
    const userItem = localStorage.getItem('user');

    if (tokenItem && userItem) {
      try {
        const tokenData = JSON.parse(tokenItem);
        const userData = JSON.parse(userItem);
        const now = new Date().getTime();

        if (now < tokenData.expiry) {
          return {
            token: tokenData.value,
            isAuthenticated: true,
            user: userData.value as User,
          };
        } else {
          // Data is expired, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Handle parsing errors and clear invalid data
        console.error('Failed to parse auth data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  // Default state for server-side render or if no valid data is found
  return {
    token: null,
    isAuthenticated: false,
    user: null,
  };
};

const initialState: AuthState = getInitialAuthState();

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
      /*if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }*/
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
