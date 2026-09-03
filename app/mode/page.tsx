'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Sparkles, Video, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StarDoodle, SparkleDoodle } from '@/components/ui/doodles';
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
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-16 flex flex-col items-center justify-center">
        {/* Title Header */}
        <div className="text-center relative max-w-2xl mx-auto mb-8 sm:mb-12 flex flex-col items-center">
          <div className="absolute -top-6 -left-6 sm:-left-8 pointer-events-none">
            <StarDoodle size={36} color="#fcd400" />
          </div>

          {/* Event Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fcd400] text-[#00327d] font-bold text-xs border-2 border-[#00327d] shadow-hard-gold-sm mb-3">
            <div className="w-4 h-4 relative shrink-0">
              <Image
                src="/champions-explorer2.png"
                alt="Champions Explorer"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span>Champions Explorer 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Pilih Mode Photobooth
          </h1>
          <p className="text-sm sm:text-lg text-[#434653] font-medium mt-2">
            Tentukan gaya momenmu di kegiatan Champions Explorer!
          </p>
        </div>

        {/* 3 Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
          {/* Card 1: PHOTO */}
          <div
            onClick={() => handleSelectMode('photo')}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col relative border-3 ${
              selected === 'photo'
                ? 'bg-[#00327d] text-white border-[#00327d] shadow-hard-blue scale-102'
                : 'bg-white text-[#1c1b1b] border-[#00327d] hover:shadow-hard-blue'
            }`}
          >
            {selected === 'photo' && (
              <div className="absolute top-4 right-4 pointer-events-none">
                <SparkleDoodle size={24} color="#fcd400" />
              </div>
            )}

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                selected === 'photo'
                  ? 'bg-[#fcd400] text-[#1c1b1b] shadow-hard-gold-sm'
                  : 'bg-[#00327d] text-white'
              }`}
            >
              <Camera className="w-7 h-7" />
            </div>

            <h3
              className={`text-2xl font-extrabold font-['var(--font-bricolage)'] ${
                selected === 'photo' ? 'text-white' : 'text-[#00327d]'
              }`}
            >
              PHOTO
            </h3>
            <p
              className={`text-sm sm:text-base mt-2 font-medium leading-relaxed ${
                selected === 'photo' ? 'text-white/80' : 'text-[#434653]'
              }`}
            >
              Ambil foto beruntun dan susun ke template strip kerenmu.
            </p>

            <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs font-bold font-mono uppercase tracking-wider">
              <span>Multi-Shot Strip</span>
              <span>{selected === 'photo' ? '● Aktif' : '○ Pilih'}</span>
            </div>
          </div>

          {/* Card 2: LIVE PHOTO */}
          <div
            onClick={() => handleSelectMode('live-photo')}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col relative border-3 ${
              selected === 'live-photo'
                ? 'bg-[#00327d] text-white border-[#00327d] shadow-hard-blue scale-102'
                : 'bg-white text-[#1c1b1b] border-[#00327d] hover:shadow-hard-blue'
            }`}
          >
            {selected === 'live-photo' && (
              <div className="absolute top-4 right-4 pointer-events-none">
                <SparkleDoodle size={24} color="#fcd400" />
              </div>
            )}

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                selected === 'live-photo'
                  ? 'bg-[#fcd400] text-[#1c1b1b] shadow-hard-gold-sm'
                  : 'bg-[#00327d] text-white'
              }`}
            >
              <Sparkles className="w-7 h-7" />
            </div>

            <h3
              className={`text-2xl font-extrabold font-['var(--font-bricolage)'] ${
                selected === 'live-photo' ? 'text-white' : 'text-[#00327d]'
              }`}
            >
              LIVE PHOTO
            </h3>
            <p
              className={`text-sm sm:text-base mt-2 font-medium leading-relaxed ${
                selected === 'live-photo' ? 'text-white/80' : 'text-[#434653]'
              }`}
            >
              Foto bergerak berframe dengan cuplikan aksi seru yang hidup saat ditekan.
            </p>

            <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs font-bold font-mono uppercase tracking-wider">
              <span>Framed + Motion</span>
              <span>{selected === 'live-photo' ? '● Aktif' : '○ Pilih'}</span>
            </div>
          </div>

          {/* Card 3: VIDEO */}
          <div
            onClick={() => handleSelectMode('video')}
            className={`rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col relative border-3 ${
              selected === 'video'
                ? 'bg-[#00327d] text-white border-[#00327d] shadow-hard-blue scale-102'
                : 'bg-white text-[#1c1b1b] border-[#00327d] hover:shadow-hard-blue'
            }`}
          >
            {selected === 'video' && (
              <div className="absolute top-4 right-4 pointer-events-none">
                <SparkleDoodle size={24} color="#fcd400" />
              </div>
            )}

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                selected === 'video'
                  ? 'bg-[#fcd400] text-[#1c1b1b] shadow-hard-gold-sm'
                  : 'bg-[#00327d] text-white'
              }`}
            >
              <Video className="w-7 h-7" />
            </div>

            <h3
              className={`text-2xl font-extrabold font-['var(--font-bricolage)'] ${
                selected === 'video' ? 'text-white' : 'text-[#00327d]'
              }`}
            >
              VIDEO
            </h3>
            <p
              className={`text-sm sm:text-base mt-2 font-medium leading-relaxed ${
                selected === 'video' ? 'text-white/80' : 'text-[#434653]'
              }`}
            >
              Rekam video singkat momen kebersamaan dengan timer otomatis.
            </p>

            <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs font-bold font-mono uppercase tracking-wider">
              <span>Max 15 Detik</span>
              <span>{selected === 'video' ? '● Aktif' : '○ Pilih'}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-12 flex items-center justify-center w-full max-w-sm">
          <Button
            variant="gold"
            size="lg"
            onClick={handleContinue}
            className="w-full text-base sm:text-lg py-4"
          >
            Lanjutkan
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}