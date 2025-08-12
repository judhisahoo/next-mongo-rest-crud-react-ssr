'use client';
//import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
/*import { updateProfile } from '@/lib/api/api';
import { ProfileFormData, profileSchema } from '@/lib/validation/auth';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { User } from '@/lib/store/features/auth/authSlice';
import { useAppSelector } from '@/lib/store/store';*/
import ProfileForm from '@/components/auth/Profile';

export default function MyPage() {
  /*const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State to hold validation errors

  const [apiError, setApiError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const userFromReux = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    setUser(userFromReux);
  }, [userFromReux]);

  console.log('user data ::', user);
  console.log('userFromReux data ::', userFromReux);
  const handleUpdateProfile = async (formData: ProfileFormData) => {
    setIsLoading(true);
    setErrors(null);

    try {
      await updateProfile(userFromReux?._id as string, formData);
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrors(error.response?.data?.message || 'Failed to update product.');
      } else if (error instanceof Error) {
        setErrors(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (errors) {
    return <div className="container mx-auto p-4 text-red-600">{errors}</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-4">Loading user data...</div>;
  }*/

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <ProfileForm />
    </div>
  );
}
