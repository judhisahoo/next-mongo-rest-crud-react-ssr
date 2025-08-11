// src/components/AuthInitializer.tsx
'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/store';
import {
  setCredentials,
  logout,
  User,
} from '@/lib/store/features/auth/authSlice';
import { getLocalStorageWithExpiration } from '@/lib/helper/storage';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedToken = getLocalStorageWithExpiration('token');
    const storedUser = getLocalStorageWithExpiration('user');

    if (storedToken && storedUser) {
      // Re-hydrate the Redux store with the data from localStorage
      dispatch(
        setCredentials({ token: storedToken, user: storedUser as User }),
      );
    } else {
      // If no valid token is found, ensure the user is logged out
      dispatch(logout());
    }
  }, [dispatch]);

  return null; // This component does not render anything
}
