'use client';

import { login } from '@/lib/api/api';
import { setCredentials } from '@/lib/store/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store/store';
import { loginSchema } from '@/lib/validation/auth';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setApiError(null);

    try {
      loginSchema.parse({ email, password });
      const data = await login({ email, password });
      // save token in redux after successfull login
      dispatch(setCredentials({ token: data.access_token, user: data.user }));

      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      // Get the redirect path from the URL
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        // Redirect to the stored path
        router.push(redirectPath);
      } else {
        // redirect url after successs login
        router.push('/me');
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        for (const issue of err.issues) {
          if (issue.path.length > 0) {
            newErrors[issue.path[0]] = issue.message;
          }
        }
        setError(newErrors);
      } else if (err instanceof AxiosError) {
        setApiError(
          err.response?.data?.message || 'Login failed. Please try again.',
        );
      } else if (err instanceof Error) {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100  p-5">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl text-center font-bold mb-6 text-gray-700">
          Login
        </h2>
        <form onSubmit={submitHandle} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block">
              Email
            </label>
            <input
              className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="email"
              id="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* "Remember Me" checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          {error && (
            <p className="text-sm font-medium text-red-600 text-center">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none  focus:ring-blue-700 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loging in' : 'Login'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="underline font-medium text-blue-600 hover:text-blue-400 hover:no-underline"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
