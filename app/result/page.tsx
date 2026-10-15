'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Share2, RefreshCw, Camera, Check, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border-3 border-[#1F1A17] flex items-center justify-center text-[#1F1A17] mb-4 shadow-brutal">
            <Camera className="w-8 h-8 text-[#3E4095]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1A17] mb-2 font-['var(--font-bricolage)']">
            BELUM ADA HASIL
          </h1>
          <p className="text-sm text-[#434653] font-medium mb-6">
            Belum ada hasil photostrip yang dicetak. Mulai sesi photobooth sekarang untuk membuat foto kenanganmu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Ke Beranda</span>
            </Button>
            <Button variant="primary" onClick={() => router.push('/mode')} className="flex-1 shadow-brutal">
              <span>Mulai Sesi</span>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isVertical = currentFrame.id === 'frame-01';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border-2 border-[#1F1A17] font-mono font-extrabold text-xs mb-3 shadow-brutal-sm select-none">
            <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700" aria-hidden="true" />
            <span>[ STATUS // SELESAI & SIAP DIUNDUH ]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            KENANGANMU SUDAH SIAP!
          </h1>
          <p className="text-xs sm:text-base text-[#434653] font-medium mt-2 leading-relaxed">
            Ini hasil photostrip digitalmu. Unduh dengan resolusi tinggi, simpan, atau bagikan momen seru ke teman-temanmu.
          </p>
        </div>

        {/* Photostrip & Action Controls Container */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-14 max-w-4xl">
          {/* Left Column: Composed Photostrip Preview in Museum Mount */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`relative rounded-3xl overflow-hidden bg-white p-3 sm:p-4 border-4 border-[#1F1A17] shadow-brutal-lg max-w-[86vw] ${
                isVertical
                  ? 'w-[240px] xs:w-[260px] sm:w-[280px] aspect-[560/1600]'
                  : 'w-[290px] xs:w-[320px] sm:w-[380px] aspect-[1067/1600]'
              }`}
            >
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 font-mono text-[10px] text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute top-2 right-2 font-mono text-[10px] text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#1F1A17]/40 select-none">+</div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#1F1A17]/40 select-none">+</div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={finalDataUrl}
                alt="GenSNAP Photostrip Final"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Right Column: Tactical Action Deck */}
          <div className="flex flex-col items-stretch gap-3.5 sm:gap-4 w-full max-w-sm">
            {/* Primary Download PNG */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPNG}
              className="w-full py-4 text-sm sm:text-base shadow-brutal font-mono font-extrabold"
            >
              <Download className="w-5 h-5 text-[#fcd400] mr-1" aria-hidden="true" />
              <span>DOWNLOAD PNG (HD)</span>
            </Button>

            {/* Download JPG */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadJPG}
              isLoading={isProcessingJPG}
              className="w-full py-4 text-sm sm:text-base shadow-brutal-sm font-mono font-extrabold"
            >
              <Download className="w-5 h-5 text-[#3E4095] mr-1" aria-hidden="true" />
              <span>DOWNLOAD JPG (COMPACT)</span>
            </Button>

            {/* Share Button */}
            <Button
              variant="gold"
              size="lg"
              onClick={handleShare}
              className="w-full py-4 text-sm sm:text-base shadow-brutal font-mono font-extrabold"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-800 mr-1" aria-hidden="true" />
                  <span>TAUTAN DIBAGIKAN!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 text-[#1F1A17] mr-1" aria-hidden="true" />
                  <span>BAGIKAN FOTO</span>
                </>
              )}
            </Button>

            <div className="w-full h-0.5 bg-[#1F1A17]/20 my-1 sm:my-2" />

            {/* Retake & Create Another Side by Side */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={handleRetakeAll}
                className="w-full text-xs font-mono font-bold py-3"
              >
                <RefreshCw className="w-4 h-4 mr-1 text-[#ED3237]" aria-hidden="true" />
                <span>ULANGI SESI</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleCreateAnother}
                className="w-full text-xs font-mono font-bold py-3"
              >
                <Camera className="w-4 h-4 mr-1 text-[#3E4095]" aria-hidden="true" />
                <span>FOTO BARU</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
