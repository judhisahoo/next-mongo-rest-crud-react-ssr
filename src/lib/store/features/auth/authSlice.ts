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

    console.log('tokenItem ::', tokenItem);
    console.log('userItem ::', userItem);

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
          // Token has expired, clear localStorage
          console.log(
            "removing localStorage.removeItem('token') with getInitialAuthState() method",
          );
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        // This block handles the case where JSON.parse fails on a raw string
        console.error('Failed to parse auth data from localStorage:', error);
        // Clear the bad data to prevent future errors
        console.log(
          "removing localStorage.removeItem('token') try with cath of getInitialAuthState() method",
        );
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  // Default state for server-side rendering or if no valid data is found
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

      const now = new Date();
      const expiry = now.getTime() + 60 * 60 * 1000; // 1 hour expiration
      if (typeof window !== 'undefined') {
        const tokenJSONStringify = JSON.stringify({
          value: action.payload.token,
          expiry,
        });

        const userJSONStringify = JSON.stringify({
          value: action.payload.user,
          expiry,
        });

        console.log('tokenJSONStringify ::', tokenJSONStringify);
        console.log('userJSONStringify ::', userJSONStringify);

        localStorage.setItem('token', tokenJSONStringify);
        localStorage.setItem('user', userJSONStringify);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        console.log(
          "removing localStorage.removeItem('token') with logout action",
        );
        //localStorage.removeItem('token');
        //localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
