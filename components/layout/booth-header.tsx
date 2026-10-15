'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';

interface BoothHeaderProps {
  /** Label shown in the yellow centre badge */
  badgeLabel: React.ReactNode;
  /** Icon shown left of the badge label */
  badgeIcon?: React.ReactNode;
  /** href for the close (×) button */
  backHref?: string;
  /** Called when the back button is clicked (before navigation) */
  onBack?: () => void;
}

/**
 * Shared sticky header used across all photobooth mode pages.
 * Left: close button + GenSNAP wordmark
 * Centre: yellow mode/progress badge
 * Right: GenBI UNIKU & Champions Explorer logo pill
 */
export function BoothHeader({
  badgeLabel,
  badgeIcon,
  backHref = '/frames',
  onBack,
}: BoothHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-3 border-[#1F1A17] px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 select-none">
      {/* Left: close + wordmark */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href={backHref}
          onClick={onBack}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center text-[#1F1A17] hover:bg-[#ED3237] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095]"
          title="Keluar"
          aria-label="Keluar dari sesi photobooth"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </Link>
        <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#1F1A17] font-['var(--font-bricolage)'] hidden min-[360px]:inline">
          GenSNAP
        </span>
      </div>

      {/* Centre: yellow badge */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-[#F5F19A] text-[#1F1A17] font-mono font-extrabold text-[11px] sm:text-xs md:text-sm border-2 border-[#1F1A17] shadow-brutal-sm max-w-[150px] min-[390px]:max-w-[210px] sm:max-w-none">
        {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
        <span className="truncate">{badgeLabel}</span>
      </div>

      {/* Right: GenBI & Champions Explorer logo pill */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#3E4095] text-white font-mono font-bold text-[11px] sm:text-xs border-2 border-[#1F1A17] shadow-brutal-sm select-none">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
            <Image
              src="/champions-explorer2.png"
              alt="Champions Explorer"
              width={18}
              height={18}
              className="w-auto h-auto object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <span className="tracking-tight uppercase hidden sm:inline">Champions Explorer</span>
        </div>
      </div>
    </header>
  );
}
