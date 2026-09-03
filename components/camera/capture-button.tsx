'use client';

import React from 'react';
import { Camera } from 'lucide-react';

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isCapturing?: boolean;
}

export function CaptureButton({
  onClick,
  disabled = false,
  isCapturing = false,
}: CaptureButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isCapturing}
      onClick={onClick}
      aria-label="Ambil Foto"
      className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#fcd400] border-4 border-[#00327d] shadow-hard-blue hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
    >
      {/* Inner Blue Ring / Button */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#00327d] flex items-center justify-center text-white group-hover:bg-[#002660] transition-colors">
        <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-[#fcd400]" />
      </div>
    </button>
  );
}
