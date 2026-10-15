'use client';

import React, { forwardRef } from 'react';
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
        className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 shadow-brutal-lg flex items-center justify-center transition-all duration-300 z-10"
        style={{
          borderColor: isRingLightActive ? ringColor : '#1F1A17',
          boxShadow: isRingLightActive
            ? `0 0 24px ${ringColor}80, 4px 4px 0px 0px #1F1A17`
            : undefined,
        }}
      >
        {/* Tactical Status Stamp at Top Left */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F1A17]/85 backdrop-blur-sm border border-white/20 text-[#fcd400] font-mono text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE SENSOR // 1080P</span>
        </div>

        {/* Active Ring Light Status Pill */}
        {isRingLightActive && (
          <div
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-extrabold border-2 border-[#1F1A17] shadow-brutal-sm select-none animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: ringColor, color: '#1F1A17' }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" />
            <span>RING LIGHT {brightness}%</span>
          </div>
        )}

        {/* Tactical HUD Corner Crosshairs */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none text-white/50 font-mono text-xs select-none">
          +
        </div>
        <div className="absolute top-3 right-3 z-10 pointer-events-none text-white/50 font-mono text-xs select-none">
          +
        </div>
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none text-white/50 font-mono text-xs select-none">
          +
        </div>
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none text-white/50 font-mono text-xs select-none">
          +
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
            className="absolute inset-0 z-40 bg-white animate-out fade-out duration-300 pointer-events-none"
            style={{ backgroundColor: ringLightConfig?.color || '#ffffff' }}
          />
        )}

        {children}
      </div>
    );
  }
);

CameraViewfinder.displayName = 'CameraViewfinder';
