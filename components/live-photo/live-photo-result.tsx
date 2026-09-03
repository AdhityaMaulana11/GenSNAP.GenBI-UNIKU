'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Download, RefreshCw, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LivePhotoData } from '@/types/photobooth';
import { triggerDownload, downloadJPG } from '@/lib/export/export-manager';

interface LivePhotoResultProps {
  data: LivePhotoData;
  onRetake: () => void;
  onRetakeSlot?: (slotIndex: number) => void;
  onCreateAnother: () => void;
}

export function LivePhotoResult({
  data,
  onRetake,
  onRetakeSlot,
  onCreateAnother,
}: LivePhotoResultProps) {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playingSlotIndex, setPlayingSlotIndex] = useState<number | null>(null);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const hasFrame = Boolean(data.frame && data.slots && data.slots.length > 0);
  const frame = data.frame;
  const slots = data.slots || [];

  // Toggle playback for all slots
  const togglePlayAll = () => {
    if (isPlayingAll) {
      Object.values(videoRefs.current).forEach((v) => {
        if (v) v.pause();
      });
      setIsPlayingAll(false);
      setPlayingSlotIndex(null);
    } else {
      Object.values(videoRefs.current).forEach((v) => {
        if (v) {
          v.currentTime = 0;
          v.play().catch((e) => console.warn('Play error', e));
        }
      });
      setIsPlayingAll(true);
      setPlayingSlotIndex(null);
    }
  };

  // Toggle playback for an individual slot
  const togglePlaySlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[slotIdx];
    if (!vid) return;

    if (playingSlotIndex === slotIdx) {
      vid.pause();
      setPlayingSlotIndex(null);
    } else {
      // Pause others
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (v && Number(k) !== slotIdx) v.pause();
      });
      vid.currentTime = 0;
      vid.play().catch((err) => console.warn('Play slot error', err));
      setPlayingSlotIndex(slotIdx);
      setIsPlayingAll(false);
    }
  };

  // Download Still Framed Photostrip (PNG)
  const handleDownloadFramedPNG = () => {
    const targetBlob = data.framedStillBlob || data.stillPhoto;
    triggerDownload(targetBlob, `GenSNAP-live-framed-${Date.now()}.png`);
  };

  // Download Still Framed Photostrip (JPG)
  const handleDownloadFramedJPG = () => {
    const targetBlob = data.framedStillBlob || data.stillPhoto;
    downloadJPG(targetBlob, 'GenSNAP-live-framed');
  };

  // Download All Motion Videos
  const handleDownloadMotionVideos = () => {
    if (slots.length > 0) {
      slots.forEach((s, idx) => {
        setTimeout(() => {
          triggerDownload(s.motionVideo, `GenSNAP-live-motion-slot${idx + 1}-${Date.now()}.mp4`);
        }, idx * 400);
      });
    } else if (data.motionVideo) {
      triggerDownload(data.motionVideo, `GenSNAP-live-motion-${Date.now()}.mp4`);
    }
  };

  // Download All Assets
  const handleDownloadAll = () => {
    handleDownloadFramedPNG();
    setTimeout(() => {
      handleDownloadMotionVideos();
    }, 600);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-8 lg:gap-12 max-w-5xl select-none">
      {/* Visual Live Photo Photostrip Display */}
      <div className="flex flex-col items-center shrink-0">
        {hasFrame && frame ? (
          /* Framed Live Photostrip */
          <div
            className="relative rounded-3xl overflow-hidden border-4 border-[#00327d] bg-white shadow-hard-blue flex items-center justify-center select-none"
            style={{
              width: frame.id === 'frame-01' ? '260px' : '320px',
              maxWidth: '90vw',
              aspectRatio: `${frame.width} / ${frame.height}`,
            }}
          >
            {/* 1. Underlying Still Composite */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.framedStillDataUrl || data.stillDataUrl}
              alt="Framed Still Photostrip"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* 2. Interactive Video Slot Overlays */}
            {slots.map((slot, idx) => {
              const frameSlot = frame.slots[idx] || frame.slots[0];
              if (!frameSlot) return null;

              const isSlotPlaying = isPlayingAll || playingSlotIndex === idx;
              const isFrontCamera = slot.facingMode === 'user';

              const leftPct = (frameSlot.x / frame.width) * 100;
              const topPct = (frameSlot.y / frame.height) * 100;
              const widthPct = (frameSlot.width / frame.width) * 100;
              const heightPct = (frameSlot.height / frame.height) * 100;

              return (
                <div
                  key={idx}
                  onClick={(e) => togglePlaySlot(idx, e)}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  }}
                  className="absolute cursor-pointer overflow-hidden group/slot"
                  title="Klik untuk memutar motion slot ini"
                >
                  {/* Motion Video — mirror if front camera to match the still photo */}
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={slot.motionVideoUrl}
                    playsInline
                    onEnded={() => {
                      if (!isPlayingAll) setPlayingSlotIndex(null);
                    }}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      isSlotPlaying ? 'opacity-100' : 'opacity-0'
                    } ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Play Icon Hint on Hover */}
                  {!isSlotPlaying && (
                    <div className="absolute inset-0 bg-black/10 group-hover/slot:bg-black/30 flex items-center justify-center transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#00327d]/80 text-[#fcd400] flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Slot mini LIVE tag */}
                  <div className="absolute bottom-1 right-1 z-10 px-1.5 py-0.5 rounded bg-[#fcd400] text-[#00327d] text-[9px] font-mono font-extrabold shadow-sm pointer-events-none">
                    LIVE #{idx + 1}
                  </div>
                </div>
              );
            })}

            {/* 3. Top Frame PNG Artwork Overlay */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frame.imageSrc}
              alt={frame.name}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />

            {/* LIVE Badge floating top left */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcd400] text-[#00327d] font-mono font-extrabold text-xs border-2 border-[#00327d] shadow-hard-gold-sm">
              <span className={`w-2 h-2 rounded-full bg-[#00327d] ${isPlayingAll ? 'animate-ping' : ''}`} />
              <span>LIVE FRAME</span>
            </div>
          </div>
        ) : (
          /* Single Live Photo fallback */
          <div
            onClick={togglePlayAll}
            className="relative w-[300px] sm:w-[360px] aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 border-[#00327d] shadow-hard-blue cursor-pointer group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.stillDataUrl}
              alt="Live Photo Still"
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                isPlayingAll ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <video
              ref={(el) => {
                videoRefs.current[0] = el;
              }}
              src={data.motionVideoUrl}
              playsInline
              onEnded={() => setIsPlayingAll(false)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                isPlayingAll ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcd400] text-[#00327d] font-mono font-extrabold text-xs border-2 border-[#00327d] shadow-hard-gold-sm">
              <span className="w-2 h-2 rounded-full bg-[#00327d] animate-ping" />
              <span>LIVE</span>
            </div>
          </div>
        )}

        {/* Play/Pause All Controller */}
        <button
          onClick={togglePlayAll}
          className="mt-3.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#00327d] text-white font-extrabold text-xs sm:text-sm border-2 border-[#00327d] shadow-hard-blue-sm hover:bg-[#00327d]/90 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          {isPlayingAll ? (
            <>
              <Pause className="w-4 h-4 fill-current text-[#fcd400]" />
              <span>Jeda Semua Motion</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-[#fcd400]" />
              <span>Putar Semua Live Motion ✨</span>
            </>
          )}
        </button>
      </div>

      {/* Action Controls & Slot Retake Panel */}
      <div className="flex flex-col items-stretch gap-4 w-full max-w-md">
        {/* Individual Slots Retake Selector (mirrors regular booth preview) */}
        {slots.length > 0 && onRetakeSlot && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#00327d] shadow-hard-blue flex flex-col gap-3">
            <div className="flex items-center justify-between border-b-2 border-[#00327d]/10 pb-2">
              <span className="text-xs sm:text-sm font-extrabold text-[#00327d] font-mono uppercase tracking-wider">
                Ulangi Foto Tertentu ({slots.length} Foto)
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Siap
              </span>
            </div>

            <div className={`grid gap-2.5 ${slots.length <= 3 ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'}`}>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-[#fcf9f8] p-2 rounded-2xl border-2 border-[#00327d]/20 hover:border-[#00327d] transition-colors"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black mb-1.5 border border-[#00327d]/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot.stillDataUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-[#00327d] text-white font-mono text-[9px] font-extrabold">
                      #{idx + 1}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRetakeSlot(idx)}
                    className="w-full py-1 px-1.5 rounded-lg bg-white hover:bg-[#00327d] text-[#00327d] hover:text-white border border-[#00327d] font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
                    title={`Ulangi pengambilan foto #${idx + 1}`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ulangi</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Options Box */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#00327d] shadow-hard-blue flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#00327d] font-extrabold text-base sm:text-lg font-['var(--font-bricolage)'] border-b-2 border-[#00327d]/10 pb-2.5">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#fcd400]" />
            <span>Simpan Hasil Live Photo</span>
          </div>

          {/* Download Framed Strip (PNG) */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleDownloadFramedPNG}
            className="w-full py-3.5 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#fcd400]" />
            Download Framed Strip (PNG)
          </Button>

          {/* Download Framed Strip (JPG) & Motion Clips */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadFramedJPG}
              className="w-full text-xs sm:text-sm py-2.5"
            >
              <ImageIcon className="w-4 h-4" />
              Strip JPG
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadMotionVideos}
              className="w-full text-xs sm:text-sm py-2.5"
            >
              <Download className="w-4 h-4" />
              Motion .MP4
            </Button>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleDownloadAll}
            className="w-full text-xs sm:text-sm py-2.5 font-bold"
          >
            <Download className="w-4 h-4" />
            Download Semua (Foto + Video)
          </Button>
        </div>

        {/* Navigation CTAs */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={onRetake}
            className="w-full text-xs sm:text-sm py-2.5"
          >
            <RefreshCw className="w-4 h-4" />
            Ulang Semua
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={onCreateAnother}
            className="w-full text-xs sm:text-sm py-2.5"
          >
            <Camera className="w-4 h-4" />
            Ganti Frame
          </Button>
        </div>
      </div>
    </div>
  );
}