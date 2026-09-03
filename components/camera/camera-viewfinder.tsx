'use client';

import React, { forwardRef } from 'react';
import { CornerDoodle, StarDoodle } from '@/components/ui/doodles';
import { CameraFacing } from '@/types/photobooth';
import { RingLightConfig } from '@/components/camera/ring-light';
import { Sparkles } from 'lucide-react';

interface CameraViewfinderProps {
  facing: CameraFacing;
  flashTriggered: boolean;
  ringLightConfig?: RingLightConfig;
  children?: React.ReactNode;
}

export const CameraViewfinder = forwardRef<HTMLVideoElement, CameraViewfinderProps>(
  ({ facing, flashTriggered, ringLightConfig, children }, ref) => {
    const isFrontCamera = facing === 'user';
    const isRingLightActive = isFrontCamera && ringLightConfig?.enabled;
    const brightness = ringLightConfig?.brightness || 80;
    const ringColor = ringLightConfig?.color || '#ffffff';

    return (
      <div
        className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 shadow-hard-blue flex items-center justify-center transition-all duration-300 z-10"
        style={{
          borderColor: isRingLightActive ? ringColor : '#00327d',
          boxShadow: isRingLightActive
            ? `0 0 24px ${ringColor}80, 4px 4px 0px 0px #00327d`
            : undefined,
        }}
      >
        {/* Yellow Star Doodle at top left */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <StarDoodle size={36} color="#fcd400" />
        </div>

        {/* Active Ring Light Status Pill */}
        {isRingLightActive && (
          <div
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-extrabold border-2 border-[#00327d] shadow-sm select-none animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: ringColor, color: '#00327d' }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" />
            <span>RING LIGHT {brightness}%</span>
          </div>
        )}

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

        {/* Live HTML5 Video Element with Real-Time Lighting Boost */}
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-all duration-200 ${
            isFrontCamera ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
          style={{
            filter: isRingLightActive
              ? `brightness(${1 + (brightness / 100) * 0.25}) contrast(${1 + (brightness / 100) * 0.08})`
              : 'none',
          }}
        />

        {/* Screen Flash Burst Overlay on Snapshot */}
        {flashTriggered && (
          <div
            className="absolute inset-0 z-50 animate-out fade-out duration-300 pointer-events-none"
            style={{ backgroundColor: isRingLightActive ? ringColor : '#ffffff' }}
          />
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
