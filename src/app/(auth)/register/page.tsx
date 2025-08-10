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
    // Sanitize other inputs as needed

    try {
      registerSchema.parse({
        name: sanitizedName,
        email,
        phone: sanitizedPhone,
        age: age ? parseInt(age) : undefined,
        dob,
        password,
        confpassword,
      });

      await register({
        name,
        email,
        phone,
        age: age ? parseInt(age) : undefined,
        dob,
        password,
      });

      //const { access_token, user } = response;

      // dispatch(setCredentials({ token: access_token, user }));
      // Redirect to the dashboard or profile page after successful registration
      // router.push('/my-account');
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        for (const issue of err.issues) {
          if (issue.path.length > 0) {
            newErrors[issue.path[0]] = issue.message;
          }
        }
        setErrors(newErrors);
      } else if (err instanceof AxiosError) {
        setApiError(
          err.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      } else if (err instanceof Error) {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: undefined,
                }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  phone: undefined,
                }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Age Input */}
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
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, age: undefined }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
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
              name="dob"
              type="date"
              required
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, dob: undefined }));
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
            )}
          </div>

          {/* Password Input */}
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

          {/* Confirm Password Input */}
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
              required
              value={confpassword}
              onChange={(e) => {
                setConfpassword(e.target.value);
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
    </div>
  );
}
