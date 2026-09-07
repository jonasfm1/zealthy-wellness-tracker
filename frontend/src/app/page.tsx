'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LoginForm } from '@/components/molecules/LoginForm';
import { authService } from '@/services/authService';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /**
   * Handles authentication logic for both login and registration.
   */
  const handleAuthentication = async (email: string, pass: string) => {
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Register new account (e.g., Bob or Ming)
        await authService.register(email, pass);
        const data = await authService.login(email, pass);
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/dashboard');
      } else {
        // Login existing account (e.g., Alice)
        const data = await authService.login(email, pass);
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <LoginForm 
        isRegistering={isRegistering}
        onSubmit={handleAuthentication}
        onToggleMode={() => {
          setIsRegistering(!isRegistering);
          setError('');
        }}
        error={error}
        loading={loading}
      />
    </div>
  );
}