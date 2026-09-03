'use client';

import React from 'react';

interface CountdownOverlayProps {
  currentCount: number | string | null;
}

export function CountdownOverlay({ currentCount }: CountdownOverlayProps) {
  if (currentCount === null) return null;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 flex items-center justify-center select-none animate-in fade-in duration-150">
      <div className="flex flex-col items-center justify-center animate-bounce">
        <span
          key={String(currentCount)}
          className="text-7xl sm:text-9xl font-extrabold text-[#fcd400] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-['var(--font-bricolage)'] scale-up"
        >
          {currentCount}
        </span>
      </div>
    </div>
  );
}
