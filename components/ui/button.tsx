import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none';

    const variants = {
      primary:
        'bg-[#00327d] text-white hover:bg-[#002660] shadow-hard-blue active-press',
      secondary:
        'bg-[#e5e2e1] text-[#1c1b1b] hover:bg-[#dcd9d9] active-press-gold',
      gold:
        'bg-[#fcd400] text-[#1c1b1b] hover:bg-[#e9c400] shadow-hard-gold active-press-gold',
      outline:
        'border-2 border-[#00327d] bg-transparent text-[#00327d] hover:bg-[#00327d]/5 active-press',
      ghost:
        'bg-transparent text-[#1c1b1b] hover:bg-[#00327d]/5 active:scale-95',
      danger:
        'bg-[#ba1a1a] text-white hover:bg-[#93000a] shadow-hard-dark active:translate-y-0.5',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2 min-h-[36px] gap-1.5',
      md: 'text-sm sm:text-base px-6 py-3 min-h-[48px] gap-2',
      lg: 'text-base sm:text-lg px-8 py-4 min-h-[56px] gap-2.5',
      icon: 'w-12 h-12 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
