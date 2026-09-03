'use client';

import React from 'react';
import Image from 'next/image';
import { ImageIcon, Check, RefreshCw } from 'lucide-react';
import { FrameConfig } from '@/types/photobooth';

export interface StripPreviewProps {
  frame: FrameConfig;
  photos: (any | null)[];
  currentPhotoIndex: number;
  onSelectSlot?: (index: number) => void;
  onReset?: () => void;
  isRecording?: boolean;
}

/** Helper to extract image URL from CapturedPhoto, LivePhotoSlot, or plain object */
function getPhotoDataUrl(photo: any): string | null {
  if (!photo) return null;
  return photo.dataUrl || photo.stillDataUrl || null;
}

export function StripPreview({
  frame,
  photos,
  currentPhotoIndex,
  onSelectSlot,
  onReset,
  isRecording = false,
}: StripPreviewProps) {
  const isVertical = frame.id === 'frame-01';
  const capturedCount = photos.filter((p) => getPhotoDataUrl(p) !== null).length;

  return (
    <>
      {/* ── Mobile Horizontal Strip Preview (< md) ───────────────────────── */}
      <div className="flex md:hidden flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border-2 border-[#00327d] shadow-hard-blue-sm w-full max-w-[440px] shrink-0">
        <div className="w-full flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold text-[#00327d] font-mono uppercase tracking-wider">
            Strip Preview ({capturedCount}/{frame.photoCount})
          </span>
          <span className="text-[10px] font-bold text-[#00327d]/60 font-mono">
            {frame.name}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 w-full overflow-x-auto py-0.5">
          {Array.from({ length: frame.photoCount }).map((_, idx) => {
            const photo = photos.find((p) => p && p.index === idx) || photos[idx];
            const dataUrl = getPhotoDataUrl(photo);
            const isNext = idx === currentPhotoIndex;
            const isClickable = Boolean(dataUrl && onSelectSlot && !isRecording);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (isClickable && onSelectSlot) onSelectSlot(idx);
                }}
                className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all shrink-0 ${
                  dataUrl
                    ? `border-[#00327d] bg-white shadow-sm ${isClickable ? 'cursor-pointer hover:scale-105' : ''}`
                    : isNext
                    ? 'border-[#fcd400] bg-[#fcd400]/20 animate-pulse ring-2 ring-[#00327d]'
                    : 'border-dashed border-[#c3c6d5] bg-gray-50'
                }`}
                title={dataUrl ? (onSelectSlot ? `Klik untuk ulangi foto #${idx + 1}` : `Foto #${idx + 1}`) : `Slot #${idx + 1}`}
              >
                {dataUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dataUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#00327d] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  </>
                ) : (
                  <ImageIcon className="w-4 h-4 text-[#c3c6d5]" />
                )}
                <div
                  className={`absolute bottom-0.5 left-0.5 px-1 rounded text-[9px] font-mono font-bold ${
                    dataUrl
                      ? 'bg-[#00327d]/80 text-white'
                      : isNext
                      ? 'bg-[#fcd400] text-[#00327d] font-extrabold'
                      : 'bg-black/10 text-[#737784]'
                  }`}
                >
                  #{idx + 1}
                </div>
              </div>
            );
          })}

          {onReset && capturedCount > 0 && !isRecording && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-xs font-bold text-[#ba1a1a] hover:bg-red-50 flex items-center gap-1 transition-colors ml-1"
              title="Reset Sesi"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Proportional Strip Preview (>= md) ──────────────────── */}
      {/* Container height bounded so Frame 01 (vertical) and Frame 02 (grid) have identical height */}
      <div className="hidden md:flex bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#00327d] shadow-hard-blue flex-col items-center shrink-0">
        {/* Card Header */}
        <div className="w-full text-center pb-2.5 mb-3 border-b-2 border-[#00327d]/20">
          <h4 className="font-extrabold text-xs sm:text-sm text-[#00327d] tracking-wider uppercase font-mono">
            STRIP PREVIEW
          </h4>
        </div>

        {/* Frame Outline Container — height matches CameraControls sidebar (~240px) */}
        <div
          className={`relative rounded-2xl bg-[#f0eded] p-2 border-2 border-dashed border-[#00327d]/40 flex flex-col items-center h-[220px] sm:h-[240px] ${
            isVertical ? 'aspect-[560/1600]' : 'aspect-[1067/1600]'
          }`}
        >
          {/* Frame Artwork Ghost Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none p-1">
            <Image
              src={frame.imageSrc}
              alt="Frame ghost"
              fill
              className="object-contain"
            />
          </div>

          {/* Slot Grid / Strip */}
          <div
            className={`relative z-10 w-full h-full ${
              isVertical
                ? 'flex flex-col justify-between gap-1.5'
                : 'grid grid-cols-2 grid-rows-3 gap-1.5'
            }`}
          >
            {Array.from({ length: frame.photoCount }).map((_, idx) => {
              const photo = photos.find((p) => p && p.index === idx) || photos[idx];
              const dataUrl = getPhotoDataUrl(photo);
              const isNext = idx === currentPhotoIndex;
              const isClickable = Boolean(dataUrl && onSelectSlot && !isRecording);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isClickable && onSelectSlot) onSelectSlot(idx);
                  }}
                  className={`relative w-full rounded-xl overflow-hidden flex items-center justify-center transition-all ${
                    isVertical ? 'flex-1 min-h-0' : 'aspect-[4/3]'
                  } ${
                    dataUrl
                      ? `border-2 border-[#00327d] bg-white shadow-sm ${isClickable ? 'cursor-pointer hover:scale-105' : ''}`
                      : isNext
                      ? 'border-2 border-dashed border-[#fcd400] bg-[#fcd400]/20 animate-pulse'
                      : 'border-2 border-dashed border-[#c3c6d5] bg-white/70'
                  }`}
                  title={dataUrl ? (onSelectSlot ? `Klik untuk ulangi foto #${idx + 1}` : `Foto #${idx + 1}`) : `Slot #${idx + 1}`}
                >
                  {dataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={dataUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-[#c3c6d5]" />
                  )}

                  {/* Number Badge */}
                  <div
                    className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      dataUrl
                        ? 'bg-[#00327d] text-white'
                        : isNext
                        ? 'bg-[#fcd400] text-[#00327d] font-extrabold ring-2 ring-[#00327d]'
                        : 'bg-[#e5e2e1] text-[#737784]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Reset button */}
        {onReset && capturedCount > 0 && !isRecording && (
          <button
            onClick={onReset}
            className="mt-3 p-1.5 px-3 rounded-lg text-xs font-bold text-[#ba1a1a] hover:bg-red-50 flex items-center gap-1 transition-colors border border-[#ba1a1a]/20"
            title="Reset Sesi"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>
    </>
  );
}
