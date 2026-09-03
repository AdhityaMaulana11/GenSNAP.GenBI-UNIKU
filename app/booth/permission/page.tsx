'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { StarDoodle, HeartDoodle, SquiggleDoodle } from '@/components/ui/doodles';
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
      <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            type={errorType}
            onRetry={requestPermission}
            backHref={mode === 'photo' ? '/frames' : '/mode'}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern-blue relative overflow-hidden">
      <Header />

      {/* Decorative Doodles matching Stitch camera_permission.png */}
      <div className="absolute top-24 left-8 sm:left-16 pointer-events-none">
        <StarDoodle size={40} color="#fcd400" />
      </div>
      <div className="absolute top-44 right-8 sm:right-20 pointer-events-none">
        <HeartDoodle size={32} color="#ff8093" />
      </div>
      <div className="absolute bottom-16 right-12 sm:right-24 pointer-events-none">
        <SquiggleDoodle size={80} color="#00327d" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 border-3 border-[#00327d] shadow-hard-blue flex flex-col items-center text-center relative">
          {/* Camera Icon in Blue Circle with Gold Dot */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-[#00327d] text-white flex items-center justify-center shadow-hard-blue-sm">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#fcd400] border-2 border-white shadow-sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
            Izinkan Akses Kamera
          </h1>

          <p className="text-sm sm:text-base text-[#434653] font-medium mt-3 max-w-sm leading-relaxed">
            GenSNAP membutuhkan akses kamera untuk mengambil foto photobooth. Semua foto tetap berada di perangkatmu dan tidak diunggah ke server.
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-[#00327d] bg-[#e8f0fe] px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#00327d]" />
            <span>100% Aman & Privasi Terjaga</span>
          </div>

          {/* Primary Allow CTA */}
          <div className="w-full mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={requestPermission}
              isLoading={isLoading}
              className="w-full text-base sm:text-lg py-4"
            >
              <Camera className="w-5 h-5 text-[#fcd400]" />
              Izinkan Kamera
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CameraPermissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <CameraPermissionContent />
    </Suspense>
  );
}
