'use client';

import React, { forwardRef } from 'react';
import { CornerDoodle, StarDoodle } from '@/components/ui/doodles';
import { CameraFacing } from '@/types/photobooth';

interface CameraViewfinderProps {
  facing: CameraFacing;
  flashTriggered: boolean;
  children?: React.ReactNode;
}

export const CameraViewfinder = forwardRef<HTMLVideoElement, CameraViewfinderProps>(
  ({ facing, flashTriggered, children }, ref) => {
    const isFrontCamera = facing === 'user';

    return (
      <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 border-[#00327d] shadow-hard-blue flex items-center justify-center">
        {/* Yellow Star Doodle at top left */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <StarDoodle size={36} color="#fcd400" />
        </div>

        {/* Viewfinder Corner Brackets */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-80">
          <CornerDoodle size={32} />
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-80 rotate-90">
          <CornerDoodle size={32} />
        </div>
        <div className="absolute bottom-10 left-4 z-10 pointer-events-none opacity-80 -rotate-90">
          <CornerDoodle size={32} />
        </div>
        <div className="absolute bottom-10 right-4 z-10 pointer-events-none opacity-80 rotate-180">
          <CornerDoodle size={32} />
        </div>

        {/* Live HTML5 Video Element */}
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isFrontCamera ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        />

        {/* Screen Flash Overlay */}
        {flashTriggered && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {/* Bottom Label Badge */}
        <div className="absolute bottom-2 z-20 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-[#00327d] text-xs font-extrabold text-[#00327d] uppercase tracking-widest font-mono select-none">
          PHOTO
        </div>

        {/* Overlays (Countdown, etc.) */}
        {children}
      </div>
    );
  }
);

CameraViewfinder.displayName = 'CameraViewfinder';
