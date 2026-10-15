import React from 'react';
import { Camera } from 'lucide-react';

interface PhotoProgressProps {
  current: number;
  total: number;
}

export function PhotoProgress({ current, total }: PhotoProgressProps) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fcd400] text-[#1F1A17] font-mono font-extrabold text-xs sm:text-sm border-2 border-[#1F1A17] shadow-brutal-sm select-none">
      <Camera className="w-4 h-4 text-[#3E4095]" />
      <span className="tracking-wide uppercase">
        FOTO {Math.min(current, total)} / {total}
      </span>
    </div>
  );
}
