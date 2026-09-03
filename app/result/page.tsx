'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Share2, RefreshCw, Camera, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { StarOutlineDoodle, HeartDoodle } from '@/components/ui/doodles';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { downloadPNG, downloadJPG, shareImage } from '@/lib/export/export-manager';

export default function ExportResultPage() {
  const router = useRouter();
  const { state, currentFrame, resetSession } = usePhotoboothSession();

  const [shareSuccess, setShareSuccess] = useState(false);
  const [isProcessingJPG, setIsProcessingJPG] = useState(false);

  const finalDataUrl = state.finalImageDataUrl;
  const finalBlob = state.finalImageBlob;

  const handleDownloadPNG = () => {
    if (finalBlob) {
      downloadPNG(finalBlob);
    }
  };

  const handleDownloadJPG = async () => {
    if (finalBlob) {
      setIsProcessingJPG(true);
      try {
        await downloadJPG(finalBlob);
      } catch (err) {
        console.error('JPG download error:', err);
      } finally {
        setIsProcessingJPG(false);
      }
    }
  };

  const handleShare = async () => {
    if (finalBlob) {
      const shared = await shareImage(finalBlob);
      if (shared) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    }
  };

  const handleCreateAnother = () => {
    resetSession();
    router.push('/mode');
  };

  const handleRetakeAll = () => {
    router.push('/booth');
  };

  if (!finalDataUrl || !finalBlob) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#00327d] mb-4">
            Belum ada hasil photostrip yang dicetak.
          </p>
          <Button variant="primary" onClick={() => router.push('/mode')}>
            Mulai Photobooth
          </Button>
        </main>
      </div>
    );
  }

  const isVertical = currentFrame.id === 'frame-01';

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative overflow-x-hidden">
      <Header />

      {/* Decorative Doodles */}
      <div className="absolute top-20 left-4 sm:left-16 pointer-events-none hidden sm:block">
        <StarOutlineDoodle size={48} color="#fcd400" />
      </div>
      <div className="absolute bottom-16 right-4 sm:right-16 pointer-events-none opacity-80 hidden sm:block">
        <HeartDoodle size={44} color="#a5bdff" />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-14 px-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Kenanganmu sudah siap!
          </h1>
          <p className="text-xs sm:text-base text-[#434653] font-medium mt-1.5 sm:mt-2 leading-relaxed">
            Here is your digital photostrip. Download, share, and keep the vibes going.
          </p>
        </div>

        {/* Photostrip & Action Controls Container */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-14 max-w-4xl">
          {/* Left Column: Composed Photostrip Preview */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`relative rounded-3xl overflow-hidden bg-white p-2.5 sm:p-3 border-4 border-[#00327d] shadow-hard-blue max-w-[86vw] ${
                isVertical
                  ? 'w-[240px] xs:w-[260px] sm:w-[280px] aspect-[560/1600]'
                  : 'w-[290px] xs:w-[320px] sm:w-[380px] aspect-[1067/1600]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={finalDataUrl}
                alt="GenSNAP Photostrip Final"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col items-stretch gap-3 sm:gap-4 w-full max-w-sm">
            {/* Primary Download PNG */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPNG}
              className="w-full py-3.5 sm:py-4 text-sm sm:text-lg"
            >
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
              <Download className="w-5 h-5 text-[#434653]" />
              Download JPG
            </Button>

            {/* Share Button */}
            <Button
              variant="gold"
              size="lg"
              onClick={handleShare}
              className="w-full py-3.5 sm:py-4 text-sm sm:text-lg"
            >
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

            {/* Retake & Create Another Side by Side */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={handleRetakeAll}
                className="w-full text-xs sm:text-sm py-2.5 sm:py-3"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleCreateAnother}
                className="w-full text-xs sm:text-sm py-2.5 sm:py-3"
              >
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
