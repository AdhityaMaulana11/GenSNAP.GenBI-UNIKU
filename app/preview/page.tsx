'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Sparkles, Layers } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { StarDoodle, SparkleDoodle } from '@/components/ui/doodles';
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

  // If no photos exist, redirect back to booth
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
      <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#00327d] mb-4">
            Belum ada foto yang diambil.
          </p>
          <Button variant="primary" onClick={() => router.push('/booth')}>
            Buka Kamera
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center">
        {/* Header Title */}
        <div className="text-center relative max-w-xl mx-auto mb-6 sm:mb-10 px-2">
          <div className="absolute -top-3 -right-6 pointer-events-none hidden sm:block">
            <SparkleDoodle size={28} color="#fcd400" />
          </div>
          <div className="absolute -bottom-2 -left-6 pointer-events-none hidden sm:block">
            <StarDoodle size={28} color="#fcd400" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Pratinjau Foto
          </h1>
          <p className="text-xs sm:text-base text-[#434653] font-medium mt-1.5 sm:mt-2">
            Periksa hasil jepretanmu. Kamu bisa mengulang foto tertentu jika diinginkan.
          </p>
        </div>

        {/* Captured Photos Grid */}
        <div
          className={`grid gap-4 sm:gap-8 w-full max-w-4xl mb-8 sm:mb-12 ${
            state.photos.length <= 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto'
              : 'grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {state.photos.map((photo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 sm:border-3 border-[#00327d] shadow-hard-blue flex flex-col items-center group relative"
            >
              {/* Badge */}
              <div className="w-full flex items-center justify-between mb-2.5 sm:mb-3">
                <span className="font-extrabold text-xs sm:text-sm text-[#00327d] uppercase tracking-wider font-mono">
                  Foto {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Siap
                </span>
              </div>

              {/* Photo Image */}
              <div className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#f0eded] border-2 border-[#00327d]/20 relative mb-3 sm:mb-4">
                {photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={photo.dataUrl}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#737784]">
                    Kosong
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
                <RefreshCw className="w-3.5 h-3.5" />
                Ulangi Foto {idx + 1}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/frames')}
            className="w-full sm:flex-1 py-3 sm:py-3.5 text-xs sm:text-sm"
          >
            <Layers className="w-4 h-4" />
            Ganti Frame
          </Button>

          <Button
            variant="gold"
            size="lg"
            onClick={handleGenerateFinal}
            isLoading={isComposing}
            className="w-full sm:flex-1 py-3 sm:py-3.5 text-sm sm:text-base"
          >
            <Sparkles className="w-5 h-5 text-[#00327d]" />
            Cetak Hasil
          </Button>
        </div>
      </main>
    </div>
  );
}
