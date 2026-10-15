'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { renderPhotostrip } from '@/lib/canvas/canvas-renderer';

export default function PhotoPreviewPage() {
  const router = useRouter();
  const {
    state,
    currentFrame,
    startRetake,
    setFinalImage,
  } = usePhotoboothSession();

  const [isComposing, setIsComposing] = useState(false);

  const validPhotos = state.photos.filter((p) => p !== null);

  const handleRetakeSingle = (index: number) => {
    startRetake(index);
    router.push('/booth');
  };

  const handleGenerateFinal = async () => {
    setIsComposing(true);
    try {
      const result = await renderPhotostrip({
        photos: state.photos,
        frame: currentFrame,
      });
      setFinalImage(result.blob, result.dataUrl);
      router.push('/result');
    } catch (err) {
      console.error('Render error:', err);
      setIsComposing(false);
    }
  };

  if (validPhotos.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border-3 border-[#1F1A17] flex items-center justify-center text-[#1F1A17] mb-4 shadow-brutal">
            <RefreshCw className="w-8 h-8 text-[#3E4095]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1A17] mb-2 font-['var(--font-bricolage)']">
            BELUM ADA FOTO
          </h1>
          <p className="text-sm text-[#434653] font-medium mb-6">
            Sesi foto kamu belum dimulai atau foto belum tersimpan di memori.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Ke Beranda</span>
            </Button>
            <Button variant="primary" onClick={() => router.push('/booth')} className="flex-1 shadow-brutal">
              <span>Buka Kamera</span>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center">
        {/* Header Title */}
        <div className="text-center relative max-w-xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="inline-block px-3 py-1 rounded-xl bg-[#F5F19A] border-2 border-[#1F1A17] text-xs font-mono font-bold text-[#1F1A17] mb-3 shadow-brutal-sm">
            [ TAHAP 03 // INSPEKSI HASIL FOTO ]
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            PRATINJAU HASIL FOTO
          </h1>
          <p className="text-xs sm:text-base text-[#434653] font-medium mt-2">
            Periksa hasil jepretanmu. Kamu bisa mengulang foto tertentu yang kurang pas sebelum dicetak.
          </p>
        </div>

        {/* Captured Photos Grid: Proof Sheet Style */}
        <div
          className={`grid gap-5 sm:gap-8 w-full max-w-4xl mb-10 sm:mb-14 ${
            state.photos.length <= 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto'
              : 'grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {state.photos.map((photo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-[#1F1A17] shadow-brutal flex flex-col items-center group relative"
            >
              {/* Badge */}
              <div className="w-full flex items-center justify-between mb-3 border-b-2 border-[#1F1A17]/15 pb-2">
                <span className="font-extrabold text-xs sm:text-sm text-[#1F1A17] uppercase tracking-wider font-mono">
                  SLOT #{idx + 1}
                </span>
                <span className="text-[10px] font-mono font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-400">
                  SIAP ✓
                </span>
              </div>

              {/* Photo Image */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#f0eded] border-2 border-[#1F1A17] relative mb-4 shadow-brutal-sm">
                {photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={photo.dataUrl}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#737784]">
                    KOSONG
                  </div>
                )}
              </div>

              {/* Retake Button for this individual photo */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRetakeSingle(idx)}
                className="w-full text-xs py-2 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ED3237]" aria-hidden="true" />
                <span>Ulangi Foto #{idx + 1}</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/frames')}
            className="w-full sm:flex-1 py-3.5 text-xs sm:text-sm font-mono"
          >
            <Layers className="w-4 h-4 mr-1 text-[#3E4095]" aria-hidden="true" />
            <span>Ganti Frame</span>
          </Button>

          <Button
            variant="gold"
            size="lg"
            onClick={handleGenerateFinal}
            isLoading={isComposing}
            className="w-full sm:flex-1 py-4 text-sm sm:text-base shadow-brutal font-mono"
          >
            <Sparkles className="w-5 h-5 text-[#1F1A17] mr-1" aria-hidden="true" />
            <span>Cetak Hasil</span>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
