import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withPattern?: boolean;
}

export function PageContainer({
  children,
  className = '',
  withPattern = false,
}: PageContainerProps) {
  return (
    <main
      className={`flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 flex flex-col items-center relative ${
        withPattern ? 'bg-dot-pattern' : ''
      } ${className}`}
    >
      {children}
    </main>
  );
}
