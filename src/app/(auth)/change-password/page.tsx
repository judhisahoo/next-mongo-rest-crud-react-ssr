'use client';

import { changePasswordSchema } from '@/lib/validation/auth';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, SetConfpassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setApiError(null);

    try {
      changePasswordSchema.parse({ oldPassword, password, confpassword });
      const response = await changePasswordSchema({ oldPassword, password }); //login({ email, password });
      console.log('response in login fun:::', response);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        for (const issue of error.issues) {
          if (issue.path.length > 0) {
            newErrors[issue.path[0]] = issue.message;
          }
        }
        setErrors(newErrors);
      } else if (error instanceof AxiosError) {
        setApiError(
          error.response?.data?.message || 'Login failed. Please try again.',
        );
      } else if (err instanceof Error) {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  oldPassword: undefined,
                }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  password: undefined,
                }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confpassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="confpassword"
              name="confpassword"
              type="password"
              required
              value={confpassword}
              onChange={(e) => {
                SetConfpassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  confpassword: undefined,
                }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.confpassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confpassword}</p>
            )}
          </div>

          {apiError && (
            <p className="text-sm font-medium text-red-600 text-center">
              {apiError}
            </p>
          )}

          <div className="flex justify-center space-x-4 pt-4">
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
              {isLoading ? 'Logging in...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
