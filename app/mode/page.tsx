'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Sparkles, Video, ArrowRight, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { PhotoboothMode } from '@/types/photobooth';

export default function ModeSelectionPage() {
  const router = useRouter();
  const { state, setMode } = usePhotoboothSession();
  const [selected, setSelected] = useState<PhotoboothMode>(state.mode || 'photo');

  const handleSelectMode = (mode: PhotoboothMode) => {
    setSelected(mode);
    setMode(mode);
  };

  const handleContinue = () => {
    setMode(selected);
    if (selected === 'photo' || selected === 'live-photo') {
      router.push('/frames');
    } else if (selected === 'video') {
      router.push('/booth/permission?mode=video');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] bg-dot-pattern relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center justify-center">
        {/* Title Header */}
        <div className="text-center relative max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
          {/* Telemetry Stage Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5F19A] text-[#1F1A17] font-mono font-extrabold text-xs border-2 border-[#1F1A17] shadow-brutal-sm mb-4 select-none">
            <div className="w-4 h-4 relative shrink-0">
              <Image
                src="/champions-explorer2.png"
                alt="Champions Explorer"
                width={16}
                height={16}
                className="w-auto h-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span>[ TAHAP 01 // PILIH MODE OPERASIONAL ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            PILIH MODE PHOTOBOOTH
          </h1>
          <p className="text-sm sm:text-lg text-[#434653] font-medium mt-3">
            Tentukan gaya abadikan momenmu di kegiatan Champions Explorer 2026.
          </p>
        </div>

        {/* 3 Tactile Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl" role="radiogroup" aria-label="Mode Photobooth">
          {/* Card 1: PHOTO */}
          <div
            role="radio"
            aria-checked={selected === 'photo'}
            tabIndex={0}
            onClick={() => handleSelectMode('photo')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectMode('photo');
              }
            }}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col justify-between relative border-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095] ${
              selected === 'photo'
                ? 'bg-[#3E4095] text-white border-[#1F1A17] shadow-brutal-lg -translate-y-1'
                : 'bg-white text-[#1F1A17] border-[#1F1A17] shadow-brutal hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#1F1A17] shadow-brutal-sm ${
                    selected === 'photo'
                      ? 'bg-[#fcd400] text-[#1F1A17]'
                      : 'bg-[#3E4095] text-white'
                  }`}
                >
                  <Camera className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-current/30 uppercase">
                  MODE 01
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-['var(--font-bricolage)'] tracking-tight mb-2">
                PHOTO STRIP
              </h2>
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  selected === 'photo' ? 'text-white/90' : 'text-[#434653]'
                }`}
              >
                Ambil foto beruntun otomatis dan susun langsung ke template strip resmi.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-current/20 flex items-center justify-between text-xs font-mono font-extrabold uppercase">
              <span>MULTI-SHOT STRIP</span>
              <span className="flex items-center gap-1">
                {selected === 'photo' ? (
                  <span className="bg-[#fcd400] text-[#1F1A17] px-2 py-0.5 rounded border border-[#1F1A17] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    AKTIF
                  </span>
                ) : (
                  <span>PILIH →</span>
                )}
              </span>
            </div>
          </div>

          {/* Card 2: LIVE PHOTO */}
          <div
            role="radio"
            aria-checked={selected === 'live-photo'}
            tabIndex={0}
            onClick={() => handleSelectMode('live-photo')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectMode('live-photo');
              }
            }}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col justify-between relative border-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095] ${
              selected === 'live-photo'
                ? 'bg-[#fcd400] text-[#1F1A17] border-[#1F1A17] shadow-brutal-lg -translate-y-1'
                : 'bg-white text-[#1F1A17] border-[#1F1A17] shadow-brutal hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#1F1A17] shadow-brutal-sm ${
                    selected === 'live-photo'
                      ? 'bg-[#3E4095] text-white'
                      : 'bg-[#fcd400] text-[#1F1A17]'
                  }`}
                >
                  <Sparkles className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-current/30 uppercase">
                  MODE 02
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-['var(--font-bricolage)'] tracking-tight mb-2">
                LIVE PHOTO
              </h2>
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  selected === 'live-photo' ? 'text-[#1F1A17]/90' : 'text-[#434653]'
                }`}
              >
                Foto berframe dengan cuplikan aksi gerak hidup yang interaktif saat disentuh.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-current/20 flex items-center justify-between text-xs font-mono font-extrabold uppercase">
              <span>FRAMED + MOTION</span>
              <span className="flex items-center gap-1">
                {selected === 'live-photo' ? (
                  <span className="bg-[#3E4095] text-white px-2 py-0.5 rounded border border-[#1F1A17] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#fcd400]" aria-hidden="true" />
                    AKTIF
                  </span>
                ) : (
                  <span>PILIH →</span>
                )}
              </span>
            </div>
          </div>

          {/* Card 3: VIDEO */}
          <div
            role="radio"
            aria-checked={selected === 'video'}
            tabIndex={0}
            onClick={() => handleSelectMode('video')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectMode('video');
              }
            }}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col justify-between relative border-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095] ${
              selected === 'video'
                ? 'bg-[#E67817] text-white border-[#1F1A17] shadow-brutal-lg -translate-y-1'
                : 'bg-white text-[#1F1A17] border-[#1F1A17] shadow-brutal hover:-translate-y-0.5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#1F1A17] shadow-brutal-sm ${
                    selected === 'video'
                      ? 'bg-white text-[#E67817]'
                      : 'bg-[#3E4095] text-white'
                  }`}
                >
                  <Video className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-current/30 uppercase">
                  MODE 03
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-['var(--font-bricolage)'] tracking-tight mb-2">
                VIDEO BOOTH
              </h2>
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  selected === 'video' ? 'text-white/90' : 'text-[#434653]'
                }`}
              >
                Rekam video kilat 15 detik momen kebersamaan dengan timer otomatis.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-current/20 flex items-center justify-between text-xs font-mono font-extrabold uppercase">
              <span>MAX 15 DETIK</span>
              <span className="flex items-center gap-1">
                {selected === 'video' ? (
                  <span className="bg-[#fcd400] text-[#1F1A17] px-2 py-0.5 rounded border border-[#1F1A17] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    AKTIF
                  </span>
                ) : (
                  <span>PILIH →</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Action Launchpad */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="w-full text-base sm:text-lg py-4 shadow-brutal"
          >
            <span>Lanjutkan Ke Frame</span>
            <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}