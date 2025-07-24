'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Used for auto-login after successful signup
import Link from 'next/link';

// Helper function to set/get theme from localStorage (copied from LoginForm)
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as 'light' | 'dark';
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export default function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme); // Theme state
  const [mounted , setMounted] = useState(false)
  // State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // Effect to apply the 'dark' class to the html element (copied from LoginForm)
  useEffect(() => {
    setMounted(true)
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });
debugger
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Registration successful! Attempting to log you in...');
        const signInResult = await signIn('cognito-credentials', {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/dashboard');
        } else {
          setError(signInResult?.error || 'Account created, but automatic login failed. Please try logging in.');
        }
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };
if(!mounted){
  return null
}
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h1M3 12H2m8.05-9.636l-.707-.707M16.95 20.071l.707.707M2.879 16.95l-.707.707m19.243-1.414l-.707-.707M14.828 4.97l1.414 1.414M9.172 19.03l-1.414-1.414M18.364 18.364l-.707.707M5.636 5.636l-.707-.707"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md mx-auto">
          Sign up to access your personalized dashboard and manage your portfolio.
        </p>

        {/* Status Messages (Error or Success) */}
        {error && (
          <div
            className="px-4 py-3 rounded-lg relative mb-6 text-center bg-red-100 border border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {message && !error && (
          <div
            className="px-4 py-3 rounded-lg relative mb-6 text-center bg-green-100 border border-green-400 text-green-700 dark:bg-green-800 dark:border-green-600 dark:text-green-200"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-150 ease-in-out sm:text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-150 ease-in-out sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-150 ease-in-out sm:text-sm"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-slash icon (hide)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.842A10.022 10.022 0 0 0 3 12c0 2.972 1.153 5.748 3.053 7.74H7.94a10.022 10.022 0 0 0 7.94-7.74H15c-.244-.244-.5-.487-.756-.725A8.995 8.995 0 0 0 12 6.5C10.7 6.5 9.475 6.744 8.35 7.218" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-.244-.244-.5-.487-.756-.725A8.995 8.995 0 0 1 12 17.5c1.3 0 2.525.244 3.65.718l1.414 1.414A10.022 10.022 0 0 0 21 12c0-2.972-1.153-5.748-3.053-7.74L19.06 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.892 16.892a1.5 1.5 0 1 0 2.122 2.121 1.5 1.5 0 0 0-2.121-2.122Z" />
                </svg>
              ) : (
                // Eye icon (show)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Input with Toggle */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-150 ease-in-out sm:text-sm"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? (
                // Eye-slash icon (hide)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.842A10.022 10.022 0 0 0 3 12c0 2.972 1.153 5.748 3.053 7.74H7.94a10.022 10.022 0 0 0 7.94-7.74H15c-.244-.244-.5-.487-.756-.725A8.995 8.995 0 0 0 12 6.5C10.7 6.5 9.475 6.744 8.35 7.218" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-.244-.244-.5-.487-.756-.725A8.995 8.995 0 0 1 12 17.5c1.3 0 2.525.244 3.65.718l1.414 1.414A10.022 10.022 0 0 0 21 12c0-2.972-1.153-5.748-3.053-7.74L19.06 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.892 16.892a1.5 1.5 0 1 0 2.122 2.121 1.5 1.5 0 0 0-2.121-2.122Z" />
                </svg>
              ) : (
                // Eye icon (show)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}