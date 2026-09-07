'use client';

import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

/**
 * Interface defining the properties accepted by the LoginForm molecule.
 */
export interface LoginFormProps {
  isRegistering: boolean;
  onSubmit: (email: string, pass: string) => void;
  onToggleMode: () => void;
  error?: string;
  loading?: boolean;
}

/**
 * LoginForm molecule handles user inputs and actions for both login and registration.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ 
  isRegistering, 
  onSubmit, 
  onToggleMode, 
  error, 
  loading 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="card p-5 shadow-lg border-0 bg-white bg-opacity-75" 
      style={{ backdropFilter: 'blur(12px)', borderRadius: '1rem', width: '100%', maxWidth: '450px' }}
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary mb-1">Zealthy Wellness</h2>
        <p className="text-muted small">Track your health metrics with ease.</p>
      </div>

      <h3 className="text-center mb-4 fw-bold text-dark">
        {isRegistering ? 'Create New Account' : 'Access the Dashboard'}
      </h3>
      
      {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

      <Input 
        label="E-mail" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        placeholder="ex: bob@email.net"
      />
      
      <Input 
        label="password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        placeholder="••••••••"
      />

      <div className="mt-4">
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Processing...' : (isRegistering ? 'Sign Up and Log In' : 'access')}
        </Button>
      </div>

      <div className="text-center mt-3">
        <button 
          type="button" 
          className="btn btn-link text-decoration-none small text-muted"
          onClick={onToggleMode}
        >
          {isRegistering ? 'Already have an account? Log in' : 'Do not have an account? Sign up.'}
        </button>
      </div>
    </form>
  );
};