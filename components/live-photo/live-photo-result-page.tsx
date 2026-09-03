'use client';

import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Download,
  RefreshCw,
  Camera,
  Sparkles,
  Image as ImageIcon,
  Share2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoothHeader } from '@/components/layout/booth-header';
import { Footer } from '@/components/layout/footer';
import { StarOutlineDoodle, HeartDoodle } from '@/components/ui/doodles';
import { LivePhotoData } from '@/types/photobooth';
import { triggerDownload, downloadJPG, shareImage } from '@/lib/export/export-manager';

interface LivePhotoResultPageProps {
  data: LivePhotoData;
  onRetake: () => void;
  onCreateAnother: () => void;
}

/**
 * Full-page Live Photo result — layout mirrors the regular /result page.
 * Left column: interactive framed photostrip with per-slot video playback.
 * Right column: download / share actions.
 */
export function LivePhotoResultPage({
  data,
  onRetake,
  onCreateAnother,
}: LivePhotoResultPageProps) {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playingSlotIndex, setPlayingSlotIndex] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isProcessingJPG, setIsProcessingJPG] = useState(false);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const hasFrame = Boolean(data.frame && data.slots && data.slots.length > 0);
  const frame = data.frame;
  const slots = data.slots ?? [];

  // ── Playback helpers ──────────────────────────────────────────────────────
  const togglePlayAll = () => {
    if (isPlayingAll) {
      Object.values(videoRefs.current).forEach((v) => v?.pause());
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

  const togglePlaySlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[slotIdx];
    if (!vid) return;
    if (playingSlotIndex === slotIdx) {
      vid.pause();
      setPlayingSlotIndex(null);
    } else {
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (v && Number(k) !== slotIdx) v.pause();
      });
      setIsPlayingAll(false);
      vid.currentTime = 0;
      vid.play().catch((e) => console.warn('Play slot error', e));
      setPlayingSlotIndex(slotIdx);
    }
  };

  // ── Export helpers ────────────────────────────────────────────────────────
  const targetBlob = data.framedStillBlob ?? data.stillPhoto;
  const targetDataUrl = data.framedStillDataUrl ?? data.stillDataUrl;

  const handleDownloadPNG = () =>
    triggerDownload(targetBlob, `GenSNAP-live-framed-${Date.now()}.png`);

  const handleDownloadJPG = async () => {
    setIsProcessingJPG(true);
    try {
      await downloadJPG(targetBlob, 'GenSNAP-live-framed');
    } catch (err) {
      console.error('JPG download error:', err);
    } finally {
      setIsProcessingJPG(false);
    }
  };

  const handleDownloadMotion = () => {
    if (slots.length > 0) {
      slots.forEach((s, idx) =>
        setTimeout(
          () => triggerDownload(s.motionVideo, `GenSNAP-live-motion-slot${idx + 1}-${Date.now()}.mp4`),
          idx * 400
        )
      );
    } else if (data.motionVideo) {
      triggerDownload(data.motionVideo, `GenSNAP-live-motion-${Date.now()}.mp4`);
    }
  };

  const handleShare = async () => {
    const shared = await shareImage(targetBlob);
    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  // ── Layout helpers ────────────────────────────────────────────────────────
  const isVertical = frame?.id === 'frame-01';

  const photostrip = hasFrame && frame ? (
    /* Framed multi-slot live photo */
    <div
      className="relative rounded-3xl overflow-hidden border-4 border-[#00327d] bg-white shadow-hard-blue select-none"
      style={{
        width: isVertical ? '240px' : '300px',
        maxWidth: '86vw',
        aspectRatio: `${frame.width} / ${frame.height}`,
      }}
    >
      {/* 1. Still composite base */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={targetDataUrl}
        alt="Framed Still Photostrip"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* 2. Interactive video overlays per slot */}
      {slots.map((slot, idx) => {
        const frameSlot = frame.slots[idx] ?? frame.slots[0];
        if (!frameSlot) return null;

        const isSlotPlaying = isPlayingAll || playingSlotIndex === idx;
        const isFront = slot.facingMode === 'user';

        return (
          <div
            key={idx}
            onClick={(e) => togglePlaySlot(idx, e)}
            style={{
              left: `${(frameSlot.x / frame.width) * 100}%`,
              top: `${(frameSlot.y / frame.height) * 100}%`,
              width: `${(frameSlot.width / frame.width) * 100}%`,
              height: `${(frameSlot.height / frame.height) * 100}%`,
            }}
            className="absolute cursor-pointer overflow-hidden group/slot"
            title="Klik untuk memutar motion"
          >
            <video
              ref={(el) => { videoRefs.current[idx] = el; }}
              src={slot.motionVideoUrl}
              playsInline
              onEnded={() => { if (!isPlayingAll) setPlayingSlotIndex(null); }}
              className={`w-full h-full object-cover transition-opacity duration-200
                ${isSlotPlaying ? 'opacity-100' : 'opacity-0'}
                ${isFront ? 'scale-x-[-1]' : ''}`}
            />
            {!isSlotPlaying && (
              <div className="absolute inset-0 bg-black/10 group-hover/slot:bg-black/30 flex items-center justify-center transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#00327d]/80 text-[#fcd400] flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            )}
            <div className="absolute bottom-1 right-1 z-10 px-1.5 py-0.5 rounded bg-[#fcd400] text-[#00327d] text-[9px] font-mono font-extrabold shadow-sm pointer-events-none">
              LIVE #{idx + 1}
            </div>
          </div>
        );
      })}

      {/* 3. Frame PNG artwork overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frame.imageSrc}
        alt={frame.name}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
      />

      {/* LIVE badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#fcd400] text-[#00327d] font-mono font-extrabold text-[10px] sm:text-xs border-2 border-[#00327d] shadow-hard-gold-sm">
        <span className={`w-2 h-2 rounded-full bg-[#00327d] ${isPlayingAll ? 'animate-ping' : ''}`} />
        <span>LIVE FRAME</span>
      </div>
    </div>
  ) : (
    /* Single live photo fallback */
    <div
      onClick={togglePlayAll}
      className="relative w-[280px] sm:w-[360px] aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 border-[#00327d] shadow-hard-blue cursor-pointer group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.stillDataUrl}
        alt="Live Photo Still"
        className={`w-full h-full object-cover transition-opacity duration-200 ${isPlayingAll ? 'opacity-0' : 'opacity-100'}`}
      />
      <video
        ref={(el) => { videoRefs.current[0] = el; }}
        src={data.motionVideoUrl}
        playsInline
        onEnded={() => setIsPlayingAll(false)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${isPlayingAll ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcd400] text-[#00327d] font-mono font-extrabold text-xs border-2 border-[#00327d] shadow-hard-gold-sm">
        <span className="w-2 h-2 rounded-full bg-[#00327d] animate-ping" />
        LIVE
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative overflow-x-hidden">
      <BoothHeader
        backHref="/frames"
        onBack={onRetake}
        badgeIcon={<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00327d]" />}
        badgeLabel="Hasil Live Photo"
      />

      {/* Decorative doodles */}
      <div className="absolute top-20 left-4 sm:left-16 pointer-events-none hidden sm:block">
        <StarOutlineDoodle size={48} color="#fcd400" />
      </div>
      <div className="absolute bottom-16 right-4 sm:right-16 pointer-events-none opacity-80 hidden sm:block">
        <HeartDoodle size={44} color="#a5bdff" />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-12 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Live Photo siap!
          </h1>
          <p className="text-xs sm:text-base text-[#434653] font-medium mt-1.5 sm:mt-2 leading-relaxed">
            Klik foto untuk memutar motion. Download, share, dan abadikan momenmu bersama GenBI UNIKU.
          </p>
        </div>

        {/* Main content row */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-14 max-w-4xl">
          {/* Left: photostrip + play control */}
          <div className="flex flex-col items-center gap-3.5 sm:gap-4 shrink-0">
            {photostrip}

            {/* Play / Pause All button */}
            <button
              onClick={togglePlayAll}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#00327d] text-white font-extrabold text-xs sm:text-sm border-2 border-[#00327d] shadow-hard-blue-sm hover:bg-[#00327d]/90 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
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

          {/* Right: action panel */}
          <div className="flex flex-col items-stretch gap-3 sm:gap-4 w-full max-w-sm">
            {/* Download PNG */}
            <Button variant="primary" size="lg" onClick={handleDownloadPNG} className="w-full py-3.5 sm:py-4 text-sm sm:text-lg">
              <Download className="w-5 h-5 text-[#fcd400]" />
              Download PNG
            </Button>

            {/* Download JPG */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadJPG}
              isLoading={isProcessingJPG}
              className="w-full py-3.5 sm:py-4 text-sm sm:text-base text-[#1c1b1b]"
            >
              <ImageIcon className="w-5 h-5 text-[#434653]" />
              Download JPG
            </Button>

            {/* Download Motion clips */}
            {slots.length > 0 && (
              <Button variant="secondary" size="lg" onClick={handleDownloadMotion} className="w-full py-3.5 sm:py-4 text-sm sm:text-base text-[#1c1b1b]">
                <Download className="w-5 h-5 text-[#434653]" />
                Download Motion (.MP4)
              </Button>
            )}

            {/* Share */}
            <Button variant="gold" size="lg" onClick={handleShare} className="w-full py-3.5 sm:py-4 text-sm sm:text-lg">
              {shareSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-700" />
                  Tautan Dibagikan!
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 text-[#00327d]" />
                  Share
                </>
              )}
            </Button>

            <div className="w-full h-px bg-[#c3c6d5] my-1 sm:my-2" />

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
              <Button variant="outline" size="md" onClick={onRetake} className="w-full text-xs sm:text-sm py-2.5 sm:py-3">
                <RefreshCw className="w-4 h-4" />
                Retake
              </Button>
              <Button variant="outline" size="md" onClick={onCreateAnother} className="w-full text-xs sm:text-sm py-2.5 sm:py-3">
                <Camera className="w-4 h-4" />
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
