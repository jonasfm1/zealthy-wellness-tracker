import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={inputId} className="form-label text-muted fw-semibold mb-1">
        {label}
      </label>
      <input 
        id={inputId}
        className={`form-control bg-white bg-opacity-75 shadow-sm ${error ? 'is-invalid' : ''}`} 
        {...props} 
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};