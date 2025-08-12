'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
/*
import { ProfileFormData, profileSchema } from '@/lib/validation/auth';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { User } from '@/lib/store/features/auth/authSlice';*/
import { useAppSelector } from '@/lib/store/store';

export default function MyPage() {
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  console.log(
    'user **************************:::::::::::::::::::::::::::::::::::::::',
    user,
  );

  const formattedDob = user?.dob
    ? new Date(user.dob).toISOString().split('T')[0]
    : '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="h-20">&nbsp;</div>

      <div className="flex flex-col items-left justify-center">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2 text-sm font-medium text-gray-700">
            Name
          </div>
          <div className="col-span-4">{user?.name}</div>

          <div className="col-span-2 text-sm font-medium text-gray-700">
            Email
          </div>
          <div className="col-span-4">{user?.email}</div>

          <div className="col-span-2 text-sm font-medium text-gray-700">
            Phone
          </div>
          <div className="col-span-4">{user?.phone}</div>

          <div className="col-span-2 text-sm font-medium text-gray-700">
            Age
          </div>
          <div className="col-span-4">{user?.age}</div>

          <div className="col-span-2 text-sm font-medium text-gray-700">
            Date of Birth
          </div>
          <div className="col-span-4">{formattedDob}</div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="button" // Use type="button" to prevent form submission
            onClick={() => router.push('/edit-profile')}
            className="w-75 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
