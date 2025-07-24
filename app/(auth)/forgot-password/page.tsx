// src/app/forgot-password/page.tsx (for App Router)
// Or pages/forgot-password.tsx (for Pages Router)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router

// No longer need CognitoUserPool or CognitoUser here directly
// import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const [step, setStep] = useState<'request_code' | 'confirm_password'>('request_code');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

 

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }
   

    try {
      const response = await fetch('/api/forgot-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'A verification code has been sent to your email.');
        setStep('confirm_password');
      } else {
        setError(data.error || 'Failed to request reset code.');
      }
    } catch (err: any) {
      console.error('Network or unexpected error during request code:', err);
      setError('An unexpected network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (!email || !verificationCode || !newPassword) {
        setError('All fields are required.');
        setLoading(false);
        return;
    }
 

    try {
      const response = await fetch('/api/forgot-password-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode, newPassword}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Your password has been reset successfully. Redirecting to login...');
        setTimeout(() => {
          router.push('/login'); // Redirect to your login page
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      console.error('Network or unexpected error during confirm password:', err);
      setError('An unexpected network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Forgot Password
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{message}</span>
          </div>
        )}

        {step === 'request_code' ? (
          <form onSubmit={handleRequestCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {loading ? 'Sending Code...' : 'Request Reset Code'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmPassword} className="space-y-6">
            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <input
                type="text"
                id="verification-code"
                name="verification-code"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter the code sent to your email"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-new-password"
                name="confirm-new-password"
                autoComplete="new-password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Confirm your new password"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('request_code')}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                Request a new code
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/login" // Link back to your login page
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Remembered your password? Log in
          </a>
        </div>
      </div>
    </div>
  );
}