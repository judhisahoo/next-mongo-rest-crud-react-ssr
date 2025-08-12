'use client';
import { updateProfile } from '@/lib/api/api';
import { setCredentials } from '@/lib/store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { ProfileFormData, profileSchema } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tokenData = useAppSelector((state) => state.auth.token);
  // Function to be executed on form submission
  const onSubmit1 = async (data: ProfileFormData) => {
    console.log('Form submitted with data:', data);
    setIsLoading(true);
    const response = await updateProfile(initialData?._id as string, data);
    console.log('response in updateProfile fun:::', response);
    const { user } = response;
    dispatch(setCredentials({ token: tokenData, user }));
    router.push('/');
  };

  const initialData = useAppSelector((state) => state.auth.user);

  // FIX: Format the dob value into 'YYYY-MM-DD' before setting defaultValues
  const formattedDob = initialData?.dob
    ? new Date(initialData.dob).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
      dob: formattedDob,
    },
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading user data...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit1)}
      className="flex flex-col items-left justify-center"
    >
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Age Field */}
      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          min="1"
          {...register('age')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      {/* Date of Birth Input */}
      <div>
        <label
          htmlFor="dob"
          className="block text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          {...register('dob')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.dob && (
          <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
        )}
      </div>
      {/* Submit Button */}
      <div className="flex justify-center space-x-4 pt-4">
        {/* The new "Cancel" button */}
        <button
          type="button" // Use type="button" to prevent form submission
          onClick={() => router.push('/me')}
          className="w-50 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-50 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
}
