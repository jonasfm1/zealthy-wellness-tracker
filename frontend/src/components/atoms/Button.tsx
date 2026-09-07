import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Defines the visual style of the button based on Bootstrap 5 variants.
   */
  variant?: 'primary' | 'secondary' | 'success' | 'outline-primary' | 'outline-secondary';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '', 
  ...props 
}) => {
  const widthClass = fullWidth ? 'w-100' : '';
  
  return (
    <button 
      className={`btn btn-${variant} ${widthClass} shadow-sm fw-bold ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};