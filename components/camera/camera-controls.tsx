'use client';

import React from 'react';
import { RefreshCw, Zap, ZapOff } from 'lucide-react';
import { CountdownDuration } from '@/types/photobooth';

interface CameraControlsProps {
  countdown: CountdownDuration;
  onSelectCountdown: (sec: CountdownDuration) => void;
  onFlipCamera: () => void;
  flashEnabled: boolean;
  onToggleFlash: () => void;
  disabled?: boolean;
}

export function CameraControls({
  countdown,
  onSelectCountdown,
  onFlipCamera,
  flashEnabled,
  onToggleFlash,
  disabled = false,
}: CameraControlsProps) {
  return (
    <div className="flex sm:flex-col items-center justify-center gap-3 sm:gap-4 p-2.5 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full border-3 border-[#00327d] shadow-hard-blue">
      {/* Flip Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onFlipCamera}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center text-[#00327d] hover:bg-[#00327d]/10 transition-colors disabled:opacity-50"
        title="Flip Camera"
      >
        <RefreshCw className="w-5 h-5" />
        <span className="text-[9px] font-bold font-mono tracking-tighter uppercase mt-0.5">
          FLIP
        </span>
      </button>

      {/* Flash Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleFlash}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-colors disabled:opacity-50 ${
          flashEnabled
            ? 'bg-[#fcd400] text-[#00327d]'
            : 'text-[#00327d] hover:bg-[#00327d]/10'
        }`}
        title="Toggle Screen Flash"
      >
        {flashEnabled ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
        <span className="text-[9px] font-bold font-mono tracking-tighter uppercase mt-0.5">
          FLASH
        </span>
      </button>

      <div className="w-px h-6 sm:w-6 sm:h-px bg-[#c3c6d5] my-1" />

      {/* Countdown Timer Options: 3s, 5s, 10s */}
      {([3, 5, 10] as CountdownDuration[]).map((sec) => (
        <button
          key={sec}
          type="button"
          disabled={disabled}
          onClick={() => onSelectCountdown(sec)}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full font-bold text-xs sm:text-sm font-mono flex items-center justify-center transition-all disabled:opacity-50 ${
            countdown === sec
              ? 'bg-[#00327d] text-white shadow-hard-blue-sm scale-105'
              : 'text-[#434653] hover:bg-[#00327d]/10'
          }`}
        >
          {sec}s
        </button>
      ))}
    </div>
  );
}
