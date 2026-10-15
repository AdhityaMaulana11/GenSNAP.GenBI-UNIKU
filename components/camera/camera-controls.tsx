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
    <div className="flex sm:flex-col items-center justify-center gap-2.5 sm:gap-4 p-2.5 sm:p-3.5 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-3 border-[#1F1A17] shadow-brutal">
      {/* Flip Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onFlipCamera}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 border-[#1F1A17] bg-[#fcf9f8] shadow-brutal-sm flex flex-col items-center justify-center text-[#1F1A17] hover:bg-[#F5F19A] transition-all disabled:opacity-50 active-brutal cursor-pointer"
        title="Flip Camera (Depan / Belakang)"
      >
        <RefreshCw className="w-5 h-5 text-[#3E4095]" />
        <span className="text-[9px] font-extrabold font-mono tracking-tighter uppercase mt-0.5">
          FLIP
        </span>
      </button>

      {/* Flash / Ring Light Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleFlash}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 border-[#1F1A17] shadow-brutal-sm flex flex-col items-center justify-center transition-all disabled:opacity-50 active-brutal cursor-pointer ${
          flashEnabled
            ? 'bg-[#fcd400] text-[#1F1A17] ring-2 ring-[#1F1A17] scale-105'
            : 'bg-[#fcf9f8] text-[#1F1A17] hover:bg-[#F5F19A]'
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
            <Sparkles className="w-5 h-5 text-[#3E4095] fill-current animate-pulse" />
          ) : (
            <Zap className="w-5 h-5 fill-current text-[#1F1A17]" />
          )
        ) : (
          <ZapOff className="w-5 h-5 text-[#434653]" />
        )}
        <span className="text-[8px] sm:text-[9px] font-extrabold font-mono tracking-tighter uppercase mt-0.5">
          {isFront ? (flashEnabled ? 'RING ON' : 'RING') : (flashEnabled ? 'FLASH ON' : 'FLASH')}
        </span>
      </button>

      <div className="w-px h-6 sm:w-6 sm:h-px bg-[#1F1A17]/20 my-0.5 sm:my-1" />

      {/* Countdown Timer Options: 3s, 5s, 10s */}
      {([3, 5, 10] as CountdownDuration[]).map((sec) => (
        <button
          key={sec}
          type="button"
          disabled={disabled}
          onClick={() => onSelectCountdown(sec)}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-extrabold text-xs sm:text-sm font-mono flex items-center justify-center transition-all disabled:opacity-50 border-2 border-[#1F1A17] active-brutal cursor-pointer ${
            countdown === sec
              ? 'bg-[#3E4095] text-white shadow-brutal-sm scale-105'
              : 'bg-white text-[#1F1A17] hover:bg-[#F5F19A]'
          }`}
        >
          {sec}s
        </button>
      ))}
    </div>
  );
}
