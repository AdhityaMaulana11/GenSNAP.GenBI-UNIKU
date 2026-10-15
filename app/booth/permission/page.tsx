'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ErrorState, ErrorType } from '@/components/ui/error-state';
import { CameraManager } from '@/lib/camera/camera-manager';

function CameraPermissionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'photo';

  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const requestPermission = async () => {
    setIsLoading(true);
    setErrorType(null);

    const manager = new CameraManager();
    try {
      await manager.startCamera('user');
      // Stop the test stream right away
      manager.stopCamera();

      // Navigate to target mode
      if (mode === 'live-photo') {
        router.push('/booth/live');
      } else if (mode === 'video') {
        router.push('/booth/video');
      } else {
        router.push('/booth');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as Error;
      if (error.message === 'CAMERA_DENIED') {
        setErrorType('camera_denied');
      } else if (error.message === 'NO_CAMERA') {
        setErrorType('no_camera');
      } else if (error.message === 'CAMERA_UNAVAILABLE') {
        setErrorType('camera_unavailable');
      } else if (error.message === 'BROWSER_UNSUPPORTED') {
        setErrorType('browser_unsupported');
      } else {
        setErrorType('camera_unavailable');
      }
    }
  };

  if (errorType) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            type={errorType}
            onRetry={requestPermission}
            backHref={mode === 'photo' ? '/frames' : '/mode'}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] bg-dot-pattern-blue relative overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 border-3 border-[#1F1A17] shadow-brutal flex flex-col items-center text-center relative">
          {/* Camera Icon in Tactical Container */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-[#3E4095] border-3 border-[#1F1A17] text-white flex items-center justify-center shadow-brutal-sm">
              <Camera className="w-10 h-10 text-[#fcd400]" aria-hidden="true" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#fcd400] border-2 border-[#1F1A17] shadow-sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F1A17] tracking-tight font-['var(--font-bricolage)']">
            IZINKAN AKSES KAMERA
          </h1>

          <p className="text-sm sm:text-base text-[#434653] font-medium mt-3 max-w-sm leading-relaxed">
            GenSNAP membutuhkan akses kamera untuk mengambil foto photobooth. Semua foto tetap berada di perangkatmu dan tidak diunggah ke server.
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs font-mono font-bold text-[#1F1A17] bg-[#F5F19A] border-2 border-[#1F1A17] px-3.5 py-1.5 rounded-xl select-none shadow-brutal-sm">
            <ShieldCheck className="w-4 h-4 text-[#3E4095]" aria-hidden="true" />
            <span>100% AMAN & PRIVASI TERJAGA</span>
          </div>

          {/* Primary Allow CTA */}
          <div className="w-full mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={requestPermission}
              isLoading={isLoading}
              className="w-full text-base sm:text-lg py-4 shadow-hard-blue"
            >
              <Camera className="w-5 h-5 text-[#fcd400] mr-1" aria-hidden="true" />
              Izinkan Kamera
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CameraPermissionPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center">Memuat...</div>}>
      <CameraPermissionContent />
    </Suspense>
  );
}
