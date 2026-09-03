'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Palette, X, Sparkles, Sliders } from 'lucide-react';

export interface RingLightConfig {
  enabled: boolean;
  brightness: number; // 20 - 100
  color: string; // hex color
}

export const RING_LIGHT_PRESETS = [
  { id: 'cool', name: 'Cool White', color: '#ffffff', textColor: '#00327d', label: '⚪ Cool (6500K)' },
  { id: 'natural', name: 'Warm Natural', color: '#fff4e0', textColor: '#7a4e00', label: '🟡 Natural (4500K)' },
  { id: 'golden', name: 'Golden Hour', color: '#ffd180', textColor: '#6b3d00', label: '🟠 Golden (3200K)' },
  { id: 'rosy', name: 'Soft Rosy', color: '#ffe4e8', textColor: '#8c2444', label: '🌸 Rosy Tint' },
  { id: 'cyan', name: 'Cyber Blue', color: '#d0e8ff', textColor: '#003d80', label: '🔵 Cyber Tint' },
];

interface RingLightOverlayProps {
  config: RingLightConfig;
}

/**
 * Maximum-Lumen MacBook Studio Light:
 * Turns the device screen into a powerful physical ring light / softbox lamp.
 * Emits massive physical lumens onto the user's face in dark environments with
 * a thick stadium neon light tube and high-intensity ambient floodlight.
 */
export function RingLightOverlay({ config }: RingLightOverlayProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!config.enabled || dimensions.width === 0 || dimensions.height === 0) return null;

  const isDesktop = dimensions.width >= 768;
  const brightnessNorm = Math.max(0.2, config.brightness / 100);

  // Geometry:
  const margin = isDesktop ? 28 : 16;
  const rectX = margin;
  const rectY = margin;
  const rectWidth = Math.max(100, dimensions.width - margin * 2);
  const rectHeight = Math.max(100, dimensions.height - margin * 2);

  // Large smooth stadium corner radius
  const cornerRadius = isDesktop ? 80 : 48;

  // Maximum Physical Light Tube Width (scaled by brightness: up to 80px on desktop)
  const tubeWidth = isDesktop
    ? Math.round(48 + brightnessNorm * 32) // 54px - 80px thick
    : Math.round(30 + brightnessNorm * 22); // 34px - 52px thick

  // High-intensity screen floodlight opacity (0.25 to 0.85 solid light emission)
  const screenFloodOpacity = Math.min(0.85, 0.15 + brightnessNorm * 0.70);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 select-none overflow-hidden transition-all duration-300">
      {/* 1. Maximum-Lumen Screen Floodlight (physically lights up face & room) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: config.color,
          opacity: screenFloodOpacity,
        }}
      />

      {/* 2. Soft Edge Luminous Diffusion Radiance */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          boxShadow: `inset 0 0 ${Math.round(120 * brightnessNorm)}px ${Math.round(50 * brightnessNorm)}px ${config.color}`,
        }}
      />

      {/* 3. SVG-Rendered Ultra-Bright MacBook Stadium Tube */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ultra-Wide Soft Radiant Flare Filter */}
          <filter id="macbook-flare-wide" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isDesktop ? '36' : '20'} />
          </filter>

          {/* Medium Frosted Glow Filter */}
          <filter id="macbook-glow-med" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={isDesktop ? '14' : '8'} />
          </filter>
        </defs>

        {/* Wide Radiant Aura */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke={config.color}
          strokeWidth={tubeWidth * 1.8}
          filter="url(#macbook-flare-wide)"
          opacity={0.8 * brightnessNorm}
        />

        {/* Medium Diffusion Tube */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke={config.color}
          strokeWidth={tubeWidth * 1.3}
          filter="url(#macbook-glow-med)"
          opacity={0.95}
        />

        {/* Solid High-Intensity Luminous Core */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke={config.color}
          strokeWidth={tubeWidth}
          opacity={1.0}
        />

        {/* White Center Reflection Beam */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke="#ffffff"
          strokeWidth={Math.round(tubeWidth * 0.45)}
          opacity={0.96}
        />
      </svg>
    </div>
  );
}

interface RingLightControlsProps {
  config: RingLightConfig;
  onChange: (newConfig: RingLightConfig) => void;
  onClose: () => void;
}

/**
 * Interactive Floating Controller for Ring Light:
 * Adjusts brightness slider (20% - 100%) and light color temperature presets.
 */
export function RingLightControls({ config, onChange, onClose }: RingLightControlsProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!config.enabled) return null;

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#fcd400] text-[#00327d] border-2 border-[#00327d] shadow-hard-gold font-mono font-extrabold text-xs hover:scale-105 active:scale-95 transition-all"
        title="Buka Pengaturan Ring Light"
      >
        <Sparkles className="w-4 h-4 text-[#00327d]" />
        <span>Ring Light ({config.brightness}%)</span>
        <div
          className="w-3.5 h-3.5 rounded-full border border-[#00327d] shrink-0 shadow-sm"
          style={{ backgroundColor: config.color }}
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 z-50 max-w-sm w-auto mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-3 border-[#00327d] shadow-hard-blue animate-in slide-in-from-bottom-3 duration-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-[#00327d]/15">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-[#00327d] shadow-sm animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <h4 className="font-extrabold text-xs sm:text-sm text-[#00327d] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#00327d]" />
            Studio Ring Light
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#434653] hover:bg-gray-100 transition-colors"
            title="Sembunyikan panel"
          >
            Minimize
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f0eded] hover:bg-red-100 hover:text-red-700 text-[#00327d] flex items-center justify-center transition-colors"
            title="Matikan Ring Light"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls Body */}
      <div className="flex flex-col gap-3.5 mt-3.5">
        {/* Brightness Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#00327d]">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#fcd400] fill-current" />
              Kecerahan Cahaya
            </span>
            <span className="font-mono text-xs font-extrabold bg-[#e8f0fe] text-[#00327d] px-2 py-0.5 rounded-full border border-[#00327d]/20">
              {config.brightness}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={config.brightness}
              onChange={(e) =>
                onChange({
                  ...config,
                  brightness: Number(e.target.value),
                })
              }
              className="w-full h-2.5 bg-[#e5e2e1] rounded-lg appearance-none cursor-pointer accent-[#00327d]"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-[#00327d] flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#00327d]" />
            Warna Cahaya
          </span>

          <div className="grid grid-cols-5 gap-1.5">
            {RING_LIGHT_PRESETS.map((preset) => {
              const isSelected = config.color.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChange({ ...config, color: preset.color })}
                  className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#00327d] ring-2 ring-[#fcd400] scale-105 shadow-sm'
                      : 'border-[#c3c6d5] hover:border-[#00327d]/60'
                  }`}
                  title={preset.label}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-black/20 shadow-inner"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-[9px] font-bold text-[#434653] truncate mt-1 max-w-[45px]">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Hex Color Picker */}
        <div className="flex items-center justify-between pt-1 border-t border-[#00327d]/10">
          <span className="text-[11px] font-medium text-[#434653]">Pilih Warna Kustom:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={config.color}
              onChange={(e) => onChange({ ...config, color: e.target.value })}
              className="w-6 h-6 rounded-lg cursor-pointer border border-[#00327d] p-0"
              title="Pilih warna cahaya kustom"
            />
            <span className="text-[10px] font-mono font-bold text-[#00327d] uppercase">
              {config.color}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
