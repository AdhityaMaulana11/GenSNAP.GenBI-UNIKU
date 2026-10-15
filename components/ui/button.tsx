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
      'inline-flex items-center justify-center font-extrabold uppercase tracking-wide rounded-xl sm:rounded-2xl transition-all duration-150 select-none cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active-brutal';

    const variants = {
      primary:
        'bg-[#3E4095] text-white border-3 border-[#1F1A17] shadow-brutal hover:bg-[#34367f] hover:-translate-y-0.5',
      secondary:
        'bg-white text-[#1F1A17] border-3 border-[#1F1A17] shadow-brutal hover:bg-[#F5F19A] hover:-translate-y-0.5',
      gold:
        'bg-[#fcd400] text-[#1F1A17] border-3 border-[#1F1A17] shadow-brutal hover:bg-[#ebd500] hover:-translate-y-0.5',
      outline:
        'border-3 border-[#1F1A17] bg-white text-[#1F1A17] shadow-brutal-sm hover:bg-[#1F1A17] hover:text-white hover:-translate-y-0.5',
      ghost:
        'bg-transparent text-[#1F1A17] hover:bg-[#1F1A17]/10 active:scale-95 border-0 shadow-none',
      danger:
        'bg-[#ED3237] text-white border-3 border-[#1F1A17] shadow-brutal hover:bg-[#d6282d] hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2 min-h-[38px] gap-1.5',
      md: 'text-xs sm:text-sm px-6 py-3 min-h-[48px] gap-2 font-mono',
      lg: 'text-sm sm:text-base px-8 py-4 min-h-[56px] gap-2.5 font-mono',
      icon: 'w-12 h-12 p-0 rounded-xl border-3 border-[#1F1A17] shadow-brutal-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
