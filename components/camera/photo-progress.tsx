import React from 'react';
import { Camera } from 'lucide-react';

interface PhotoProgressProps {
  current: number;
  total: number;
}

export function PhotoProgress({ current, total }: PhotoProgressProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcd400] text-[#1c1b1b] font-extrabold text-xs sm:text-sm border-2 border-[#00327d] shadow-hard-gold-sm select-none">
      <Camera className="w-4 h-4 text-[#00327d]" />
      <span className="tracking-wide uppercase">
        FOTO {Math.min(current, total)} / {total}
      </span>
    </div>
  );
}
