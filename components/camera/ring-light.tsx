'use client';

import React, { useState } from 'react';
import { Sun, Palette, X, Sparkles, Sliders } from 'lucide-react';

export interface RingLightConfig {
  enabled: boolean;
  brightness: number; // 20 - 100
  color: string; // hex color
}

export const RING_LIGHT_PRESETS = [
  { id: 'cool', name: 'Cool White', color: '#ffffff', textColor: '#00327d', label: '⚪ Cool (6500K)' },
  { id: 'natural', name: 'Warm Natural', color: '#fff3db', textColor: '#7a4e00', label: '🟡 Natural (4500K)' },
  { id: 'golden', name: 'Golden Hour', color: '#ffc875', textColor: '#6b3d00', label: '🟠 Golden (3200K)' },
  { id: 'rosy', name: 'Soft Rosy', color: '#ffdbe4', textColor: '#8c2444', label: '🌸 Rosy Tint' },
  { id: 'cyan', name: 'Cyber Blue', color: '#cce4ff', textColor: '#003d80', label: '🔵 Cyber Tint' },
];

interface RingLightOverlayProps {
  config: RingLightConfig;
}

/**
 * Screen Ring Light Overlay:
 * Casts real ambient light from the screen onto the user's face in low-light conditions.
 * Features a glowing ring border around the viewfinder plus edge illumination.
 */
export function RingLightOverlay({ config }: RingLightOverlayProps) {
  if (!config.enabled) return null;

  const opacity = Math.max(0.2, config.brightness / 100);

  return (
    <>
      {/* Full screen edge illumination aura (casts physical light from monitor/phone screen) */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-all duration-200"
        style={{
          boxShadow: `inset 0 0 ${Math.round(config.brightness * 1.2)}px ${Math.round(
            config.brightness * 0.5
          )}px ${config.color}`,
          backgroundColor: `${config.color}${Math.round(opacity * 25).toString(16).padStart(2, '0')}`,
        }}
      />
    </>
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
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#fcd400] text-[#00327d] border-2 border-[#00327d] shadow-hard-gold font-mono font-extrabold text-xs hover:scale-105 active:scale-95 transition-all"
        title="Buka Pengaturan Ring Light"
      >
        <Sparkles className="w-4 h-4 text-[#00327d]" />
        <span>Ring Light ({config.brightness}%)</span>
        <div
          className="w-3.5 h-3.5 rounded-full border border-[#00327d] shrink-0"
          style={{ backgroundColor: config.color }}
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 z-40 max-w-sm w-auto mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-3 border-[#00327d] shadow-hard-blue animate-in slide-in-from-bottom-3 duration-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-[#00327d]/15">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-[#00327d] shadow-sm animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <h4 className="font-extrabold text-xs sm:text-sm text-[#00327d] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#00327d]" />
            Screen Ring Light
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
              Kecerahan
            </span>
            <span className="font-mono text-xs font-extrabold bg-[#e8f0fe] px-2 py-0.5 rounded-full">
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
