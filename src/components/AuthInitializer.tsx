// src/components/AuthInitializer.tsx
'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/store';
import { setCredentials } from '@/lib/store/features/auth/authSlice';
import { getLocalStorageWithExpiration } from '@/lib/helper/storage';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getLocalStorageWithExpiration('token');
    const user = getLocalStorageWithExpiration('user');

    if (token && user) {
      // Re-hydrate the Redux store with the data from localStorage
      dispatch(setCredentials({ token, user }));
    } else {
      // If no valid token is found, ensure the user is logged out
      //dispatch(logout());
    }
  }, [dispatch]);

  return null; // This component does not render anything
}
