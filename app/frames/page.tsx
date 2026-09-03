'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Sparkles, Upload, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StarDoodle, StarOutlineDoodle } from '@/components/ui/doodles';
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
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern-blue relative overflow-x-hidden">
      <Header />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Left Vertical Nav Toolbar (from Stitch design) */}
        <aside className="hidden lg:flex flex-col items-center gap-6 py-12 px-6 border-r-3 border-[#00327d]/15">
          <Link
            href={state.mode === 'live-photo' ? '/booth/permission?mode=live-photo' : '/booth/permission?mode=photo'}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#434653] hover:bg-[#00327d]/10 transition-colors"
            title="Camera"
          >
            <Camera className="w-6 h-6" />
          </Link>
          <div
            className="w-12 h-12 rounded-2xl bg-[#00327d] text-white flex items-center justify-center shadow-hard-blue-sm"
            title="Frames"
          >
            <ImageIcon className="w-6 h-6 text-[#fcd400]" />
          </div>
          <Link
            href="/#frames"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#434653] hover:bg-[#00327d]/10 transition-colors"
            title="Gallery"
          >
            <Sparkles className="w-6 h-6" />
          </Link>
          <Link
            href="/frames/custom"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#434653] hover:bg-[#00327d]/10 transition-colors"
            title="Upload Custom"
          >
            <Upload className="w-6 h-6" />
          </Link>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-5 sm:px-10 py-10 sm:py-14 flex flex-col items-center relative">
          {/* Header Title with Star Doodles */}
          <div className="text-center relative max-w-2xl mx-auto mb-10">
            <div className="absolute -top-4 -left-6 pointer-events-none">
              <StarOutlineDoodle size={32} color="#fcd400" />
            </div>
            <div className="absolute -top-3 -right-6 pointer-events-none">
              <StarDoodle size={28} color="#fcd400" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00327d] text-white font-bold text-xs mb-3 shadow-hard-blue-sm">
              {state.mode === 'live-photo' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#fcd400]" />
                  <span>Mode: Live Photo Frame</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-[#fcd400]" />
                  <span>Mode: Photo Strip</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
              Pilih Frame Favoritmu
            </h1>
            <p className="text-sm sm:text-base text-[#434653] font-medium mt-2">
              Pilih layout frame untuk sesi {state.mode === 'live-photo' ? 'Live Photo' : 'Photobooth'}-mu
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

          {/* Bottom Actions: Custom Frame Upload & Start Photobooth */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link href="/frames/custom" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto px-6 py-3"
              >
                <Upload className="w-4 h-4" />
                Upload Custom Frame
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-3"
            >
              Mulai Foto
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Bottom Right Decorative Star */}
          <div className="absolute bottom-4 right-6 pointer-events-none hidden md:block">
            <StarOutlineDoodle size={36} color="#fcd400" />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}