'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { CameraManager } from '@/lib/camera/camera-manager';
import { captureVideoFrame } from '@/lib/camera/photo-capture';
import { CameraViewfinder } from '@/components/camera/camera-viewfinder';
import { CameraControls } from '@/components/camera/camera-controls';
import { CaptureButton } from '@/components/camera/capture-button';
import { StripPreview } from '@/components/camera/strip-preview';
import { CountdownOverlay } from '@/components/camera/countdown-overlay';
import { BoothHeader } from '@/components/layout/booth-header';
import { RingLightOverlay, RingLightControls, RingLightConfig } from '@/components/camera/ring-light';
import { ArrowDoodle } from '@/components/ui/doodles';
import { ErrorState, ErrorType } from '@/components/ui/error-state';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { CameraFacing, CountdownDuration } from '@/types/photobooth';

export default function BoothCameraPage() {
  const router = useRouter();
  const {
    state,
    currentFrame,
    addPhoto,
    replacePhoto,
    cancelRetake,
    setCountdown,
  } = usePhotoboothSession();

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);

  const [facing, setFacing] = useState<CameraFacing>('user');
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [flashTriggered, setFlashTriggered] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number | string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  // Screen Ring Light Configuration for front camera
  const [ringLightConfig, setRingLightConfig] = useState<RingLightConfig>({
    enabled: false,
    brightness: 80,
    color: '#ffffff',
  });

  // Initialize camera
  useEffect(() => {
    let isMounted = true;

    async function initCamera() {
      if (!cameraManagerRef.current) {
        cameraManagerRef.current = new CameraManager();
      }

      try {
        const stream = await cameraManagerRef.current.startCamera(facing);
        if (!isMounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (isMounted) {
              videoRef.current?.play();
              setIsCameraReady(true);
            }
          };
        }

        // If rear camera and flash was enabled, activate hardware torch
        if (facing === 'environment' && flashEnabled) {
          await cameraManagerRef.current.setTorch(true);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
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
    }

    initCamera();

    return () => {
      isMounted = false;
      cameraManagerRef.current?.stopCamera();
    };
  }, [facing]);

  // Flip front/rear camera
  const handleFlipCamera = async () => {
    setIsCameraReady(false);
    setErrorType(null);
    const nextFacing = facing === 'user' ? 'environment' : 'user';

    // Turn off torch when leaving rear camera
    if (cameraManagerRef.current && facing === 'environment') {
      await cameraManagerRef.current.setTorch(false);
    }

    setFacing(nextFacing);

    // Update ring light state based on facing
    if (nextFacing === 'user' && flashEnabled) {
      setRingLightConfig((prev) => ({ ...prev, enabled: true }));
    } else {
      setRingLightConfig((prev) => ({ ...prev, enabled: false }));
    }
  };

  // Toggle flash (Ring Light on front camera, Hardware Torch on rear camera)
  const handleToggleFlash = async () => {
    const nextState = !flashEnabled;
    setFlashEnabled(nextState);

    if (facing === 'user') {
      // Front camera: toggle screen ring light
      setRingLightConfig((prev) => ({
        ...prev,
        enabled: nextState,
      }));
    } else {
      // Rear camera: toggle hardware torch if supported
      if (cameraManagerRef.current) {
        await cameraManagerRef.current.setTorch(nextState);
      }
    }
  };

  // Trigger flash pulse effect during snap
  const triggerFlash = () => {
    if (flashEnabled) {
      setFlashTriggered(true);
      setTimeout(() => setFlashTriggered(false), 250);
    }
  };

  // Perform a single frame capture
  const takeSingleSnap = async (targetIndex: number, isRetake: boolean) => {
    if (!videoRef.current) return;

    triggerFlash();
    try {
      const photo = await captureVideoFrame(videoRef.current, facing === 'user');
      if (isRetake) {
        replacePhoto(targetIndex, photo);
        router.push('/preview');
      } else {
        addPhoto(photo);
      }
    } catch (err) {
      console.error('Capture error:', err);
    }
  };

  // Countdown timer sequence
  const startCountdown = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      let count = duration;
      setCountdownValue(count);

      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdownValue(count);
        } else if (count === 0) {
          setCountdownValue('SMILE!');
        } else {
          clearInterval(interval);
          setCountdownValue(null);
          resolve();
        }
      }, 900);
    });
  };

  // Start Multi-photo capture sequence or retake
  const handleStartCaptureSequence = async () => {
    if (isCapturing || !isCameraReady) return;
    setIsCapturing(true);

    if (state.isRetaking && state.retakeIndex !== null) {
      // Retake single photo
      await startCountdown(state.countdown);
      await takeSingleSnap(state.retakeIndex, true);
      setIsCapturing(false);
      return;
    }

    // Capture photos one by one
    const totalToCapture = currentFrame.photoCount;
    let currentIndex = state.photos.filter((p) => p !== null).length;

    while (currentIndex < totalToCapture) {
      await startCountdown(state.countdown);
      await takeSingleSnap(currentIndex, false);
      currentIndex += 1;

      // Small pause between multiple shots if more remaining
      if (currentIndex < totalToCapture) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    setIsCapturing(false);
    // All photos captured -> navigate to preview
    router.push('/preview');
  };

  if (errorType) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
        <main className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            type={errorType}
            onRetry={() => {
              setErrorType(null);
              setIsCameraReady(false);
              setFacing((prev) => (prev === 'user' ? 'user' : 'environment'));
            }}
            backHref="/frames"
          />
        </main>
      </div>
    );
  }

  const capturedCount = state.photos.filter((p) => p !== null).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern-blue select-none overflow-x-hidden relative">
      {/* Screen Ring Light Ambient Edge Illumination */}
      <RingLightOverlay config={ringLightConfig} />

      <BoothHeader
        backHref="/frames"
        onBack={() => { if (state.isRetaking) cancelRetake(); }}
        badgeIcon={<Camera className="w-4 h-4 text-[#00327d]" />}
        badgeLabel={
          state.isRetaking
            ? `Ulangi Foto #${(state.retakeIndex ?? 0) + 1}`
            : `Foto: ${currentFrame.name} (${Math.min(capturedCount + 1, currentFrame.photoCount)}/${currentFrame.photoCount})`
        }
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 flex flex-col items-center justify-center relative z-20">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start lg:items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          {/* Left Controls Panel */}
          <div className="order-2 md:order-1 flex md:flex-col items-center justify-center shrink-0">
            <CameraControls
              countdown={state.countdown}
              onSelectCountdown={(sec: CountdownDuration) => setCountdown(sec)}
              onFlipCamera={handleFlipCamera}
              flashEnabled={flashEnabled}
              onToggleFlash={handleToggleFlash}
              facing={facing}
              disabled={isCapturing}
            />
          </div>

          {/* Center Viewfinder & Capture Trigger */}
          <div className="order-1 md:order-2 flex flex-col items-center w-full max-w-[480px] md:max-w-[440px] lg:max-w-[560px] xl:max-w-2xl">
            <CameraViewfinder
              ref={videoRef}
              facing={facing}
              flashTriggered={flashTriggered}
              ringLightConfig={ringLightConfig}
            >
              <CountdownOverlay currentCount={countdownValue} />
            </CameraViewfinder>

            {/* Bottom Trigger Area */}
            <div className="relative mt-4 sm:mt-6 flex items-center justify-center">
              {/* Playful Arrow Doodle pointing to capture button */}
              <div className="absolute -left-16 sm:-left-20 top-2 pointer-events-none hidden sm:block">
                <ArrowDoodle size={44} color="#00327d" />
              </div>

              <CaptureButton
                onClick={handleStartCaptureSequence}
                disabled={!isCameraReady || isCapturing}
                isCapturing={isCapturing}
              />
            </div>
          </div>

          {/* Right Strip Preview */}
          <div className="order-3 flex md:flex-col items-center shrink-0 w-full md:w-auto">
            <StripPreview
              frame={currentFrame}
              photos={state.photos}
              currentPhotoIndex={
                state.isRetaking ? (state.retakeIndex ?? 0) : capturedCount
              }
            />
          </div>
        </div>
      </main>

      {/* Floating Screen Ring Light Controller (Front Camera) */}
      {facing === 'user' && ringLightConfig.enabled && (
        <RingLightControls
          config={ringLightConfig}
          onChange={setRingLightConfig}
          onClose={() => {
            setRingLightConfig((prev) => ({ ...prev, enabled: false }));
            setFlashEnabled(false);
          }}
        />
      )}
    </div>
  );
}
