'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'font-bold rounded-xl transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
      primary: 'bg-[#58cc02] hover:bg-[#4caf00] text-white shadow-[0_4px_0_#46a302] active:shadow-[0_2px_0_#46a302] active:translate-y-[2px]',
      secondary: 'bg-[#1cb0f6] hover:bg-[#0095d9] text-white shadow-[0_4px_0_#0076ab] active:shadow-[0_2px_0_#0076ab] active:translate-y-[2px]',
      danger: 'bg-[#ff4b4b] hover:bg-[#e63e3e] text-white shadow-[0_4px_0_#cc3333] active:shadow-[0_2px_0_#cc3333] active:translate-y-[2px]',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      outline: 'bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_4px_0_#e5e5e5] active:shadow-[0_2px_0_#e5e5e5] active:translate-y-[2px]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
