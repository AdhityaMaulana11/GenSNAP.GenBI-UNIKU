'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Sparkles, Upload, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { FrameCard } from '@/components/frames/frame-card';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { getAllFrames } from '@/lib/frames/frames';

export default function FrameSelectionPage() {
  const router = useRouter();
  const { state, setFrame } = usePhotoboothSession();
  const allFrames = getAllFrames(state.customFrame);

  const handleContinue = () => {
    if (state.mode === 'live-photo') {
      router.push('/booth/permission?mode=live-photo');
    } else {
      router.push('/booth/permission?mode=photo');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] bg-dot-pattern-blue relative overflow-x-hidden">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        {/* Tactical Quick Rail */}
        <aside aria-label="Aksi Cepat" className="flex lg:flex-col items-center justify-center gap-3 sm:gap-4 py-4 lg:py-12 px-4 sm:px-6 border-b-3 lg:border-b-0 lg:border-r-3 border-[#1F1A17] bg-white/50">
          <Link
            href={state.mode === 'live-photo' ? '/booth/permission?mode=live-photo' : '/booth/permission?mode=photo'}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center text-[#1F1A17] hover:bg-[#3E4095] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095]"
            title="Kamera Langsung"
            aria-label="Kamera Langsung"
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </Link>
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#3E4095] text-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center select-none"
            title="Koleksi Frame Aktif"
            aria-label="Koleksi Frame Aktif"
          >
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#fcd400]" aria-hidden="true" />
          </div>
          <Link
            href="/#frames"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center text-[#1F1A17] hover:bg-[#F5F19A] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095]"
            title="Galeri Landing"
            aria-label="Galeri Landing"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#3E4095]" aria-hidden="true" />
          </Link>
          <Link
            href="/frames/custom"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-[#1F1A17] shadow-brutal-sm flex items-center justify-center text-[#1F1A17] hover:bg-[#3E4095] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3E4095]"
            title="Upload Custom Frame"
            aria-label="Upload Custom Frame"
          >
            <Upload className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </Link>
        </aside>

        {/* Main Specimen Gallery Area */}
        <main className="flex-1 px-5 sm:px-10 py-8 sm:py-14 flex flex-col items-center relative">
          {/* Header Title */}
          <div className="text-center relative max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5F19A] text-[#1F1A17] font-mono font-extrabold text-xs mb-3 border-2 border-[#1F1A17] shadow-brutal-sm select-none">
              {state.mode === 'live-photo' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#3E4095]" aria-hidden="true" />
                  <span>[ MODE: LIVE PHOTO FRAME ]</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-[#3E4095]" aria-hidden="true" />
                  <span>[ MODE: PHOTO STRIP ]</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
              PILIH FRAME FAVORITMU
            </h1>
            <p className="text-sm sm:text-base text-[#434653] font-medium mt-2">
              Pilih layout frame resmi untuk sesi {state.mode === 'live-photo' ? 'Live Photo' : 'Photobooth'} kamu.
            </p>
          </div>

          {/* Frames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 w-full max-w-3xl items-start">
            {allFrames.map((frame) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                isSelected={state.selectedFrameId === frame.id}
                onSelect={(id) => setFrame(id)}
              />
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link href="/frames/custom" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto px-6 py-3"
              >
                <Upload className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>Upload Custom</span>
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-3 shadow-brutal"
            >
              <span>Mulai Foto</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}