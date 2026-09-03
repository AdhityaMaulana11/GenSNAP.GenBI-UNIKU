'use client';

import React from 'react';
import { RefreshCw, Zap, ZapOff, Sparkles } from 'lucide-react';
import { CountdownDuration, CameraFacing } from '@/types/photobooth';

interface CameraControlsProps {
  countdown: CountdownDuration;
  onSelectCountdown: (sec: CountdownDuration) => void;
  onFlipCamera: () => void;
  flashEnabled: boolean;
  onToggleFlash: () => void;
  facing?: CameraFacing;
  disabled?: boolean;
}

export function CameraControls({
  countdown,
  onSelectCountdown,
  onFlipCamera,
  flashEnabled,
  onToggleFlash,
  facing = 'user',
  disabled = false,
}: CameraControlsProps) {
  const isFront = facing === 'user';

  return (
    <div className="flex sm:flex-col items-center justify-center gap-2.5 sm:gap-4 p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full border-3 border-[#00327d] shadow-hard-blue">
      {/* Flip Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onFlipCamera}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center text-[#00327d] hover:bg-[#00327d]/10 transition-colors disabled:opacity-50"
        title="Flip Camera (Depan / Belakang)"
      >
        <RefreshCw className="w-5 h-5" />
        <span className="text-[9px] font-bold font-mono tracking-tighter uppercase mt-0.5">
          FLIP
        </span>
      </button>

      {/* Flash / Ring Light Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleFlash}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all disabled:opacity-50 ${
          flashEnabled
            ? 'bg-[#fcd400] text-[#00327d] ring-2 ring-[#00327d] shadow-hard-gold-sm scale-105'
            : 'text-[#00327d] hover:bg-[#00327d]/10'
        }`}
        title={
          isFront
            ? flashEnabled
              ? 'Matikan Screen Ring Light'
              : 'Aktifkan Screen Ring Light'
            : flashEnabled
            ? 'Matikan Flash Kamera Belakang'
            : 'Aktifkan Flash Kamera Belakang'
        }
      >
        {flashEnabled ? (
          isFront ? (
            <Sparkles className="w-5 h-5 text-[#00327d] fill-current animate-pulse" />
          ) : (
            <Zap className="w-5 h-5 fill-current" />
          )
        ) : (
          <ZapOff className="w-5 h-5" />
        )}
        <span className="text-[8px] sm:text-[9px] font-extrabold font-mono tracking-tighter uppercase mt-0.5">
          {isFront ? (flashEnabled ? 'RING ON' : 'RING') : (flashEnabled ? 'FLASH ON' : 'FLASH')}
        </span>
      </button>

      <div className="w-px h-6 sm:w-6 sm:h-px bg-[#c3c6d5] my-0.5 sm:my-1" />

      {/* Countdown Timer Options: 3s, 5s, 10s */}
      {([3, 5, 10] as CountdownDuration[]).map((sec) => (
        <button
          key={sec}
          type="button"
          disabled={disabled}
          onClick={() => onSelectCountdown(sec)}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full font-bold text-xs sm:text-sm font-mono flex items-center justify-center transition-all disabled:opacity-50 ${
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
