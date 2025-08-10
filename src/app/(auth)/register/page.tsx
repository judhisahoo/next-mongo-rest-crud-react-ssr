// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/api';
import Link from 'next/link';
import { registerSchema } from '@/lib/validation/auth';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');

  const [password, setPassword] = useState('');
  const [confpassword, setConfpassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State to hold validation errors

  const router = useRouter();

  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setApiError(null);

    // Sanitize the name input
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedPhone = DOMPurify.sanitize(phone);
    //const sanitizedAge = DOMPurify.sanitize(age);
    //const sanitizedConfpassword = DOMPurify.sanitize(confpassword);
    //const sanitizedDob = DOMPurify.sanitize(dob);

    try {
      console.log('data validation in client side..');
      // Validate form data using Zod
      registerSchema.parse({
        name: sanitizedName,
        email,
        password,
        phone: sanitizedPhone,
        age: Number(age),
        dob,
        confpassword,
      });

      console.log('cmming for send data to server though API.');
      // Call the register API helper function
      await register({
        name: sanitizedName,
        email,
        password,
        phone: sanitizedPhone,
        age: Number(age),
        dob: new Date(dob),
        status: true,
      });
      // Redirect to the login page after successful registration
      router.push('/login');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const newErrors: { [key: string]: string } = {};
        for (const issue of err.issues) {
          newErrors[issue.path[0]] = issue.message;
        }
        setErrors(newErrors);
      } else if (err instanceof AxiosError) {
        // The interceptor has already handled network errors.
        // We now handle other server-side errors (e.g., 400, 409).
        setApiError(
          err.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      } else if (err instanceof Error) {
        // This will catch the custom error thrown by the interceptor
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <svg
            className="animate-spin h-10 w-10 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {!isLoading && (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: undefined,
                  }));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  (setEmail(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      email: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => {
                  (setPhone(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      phone: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                value={age}
                onChange={(e) => {
                  (setAge(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      age: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-500">{errors.age}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={dob}
                onChange={(e) => {
                  (setDob(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      dov: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
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
                  (setPassword(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      password: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confpassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confpassword"
                name="confpassword"
                type="password"
                required={!!password} // Only require if password has a value
                value={confpassword}
                onChange={(e) => {
                  (setConfpassword(e.target.value),
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      confpassword: undefined,
                    })));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {/* The conditional rendering for the error message was missing here */}
              {errors.confpassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confpassword}
                </p>
              )}
            </div>
            {apiError && (
              <p className="text-sm font-medium text-red-600 text-center">
                {apiError}
              </p>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline font-medium text-blue-600 hover:text-blue-500 hover:no-underline"
            >
              Login here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
