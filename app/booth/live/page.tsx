'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, RefreshCw, ArrowRight, Play, Pause } from 'lucide-react';
import { CameraManager } from '@/lib/camera/camera-manager';
import { MediaRecorderManager } from '@/lib/media/media-recorder-manager';
import { captureVideoFrame } from '@/lib/camera/photo-capture';
import { renderPhotostrip } from '@/lib/canvas/canvas-renderer';
import { CameraControls } from '@/components/camera/camera-controls';
import { CaptureButton } from '@/components/camera/capture-button';
import { CountdownOverlay } from '@/components/camera/countdown-overlay';
import { StripPreview } from '@/components/camera/strip-preview';
import { BoothHeader } from '@/components/layout/booth-header';
import { LivePhotoResultPage } from '@/components/live-photo/live-photo-result-page';
import { RingLightOverlay, RingLightControls, RingLightConfig } from '@/components/camera/ring-light';
import { Button } from '@/components/ui/button';
import { ErrorState, ErrorType } from '@/components/ui/error-state';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { CameraFacing, CountdownDuration, LivePhotoData, LivePhotoSlot } from '@/types/photobooth';

type BoothStage = 'capturing' | 'preview' | 'result';

export default function LivePhotoBoothPage() {
  const router = useRouter();
  const { currentFrame, state, setCountdown, resetSession, setLivePhoto } = usePhotoboothSession();

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const mediaRecorderRef = useRef<MediaRecorderManager | null>(null);

  const [facing, setFacing] = useState<CameraFacing>('user');
  // Incrementing cameraKey forces camera useEffect to re-run without changing `facing`
  const [cameraKey, setCameraKey] = useState(0);

  const [flashEnabled, setFlashEnabled] = useState(false);
  const [flashTriggered, setFlashTriggered] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingFinal, setIsProcessingFinal] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  // Screen Ring Light Configuration for front camera
  const [ringLightConfig, setRingLightConfig] = useState<RingLightConfig>({
    enabled: false,
    brightness: 80,
    color: '#ffffff',
  });

  const totalSlots = currentFrame.photoCount || 1;
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [capturedSlots, setCapturedSlots] = useState<LivePhotoSlot[]>([]);
  const [liveResult, setLiveResult] = useState<LivePhotoData | null>(null);
  const [retakingSlotIndex, setRetakingSlotIndex] = useState<number | null>(null);
  const [stage, setStage] = useState<BoothStage>('capturing');

  // ── Camera lifecycle ────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'capturing') return;

    let isMounted = true;
    setIsCameraReady(false);

    const cameraManager = new CameraManager();
    cameraManagerRef.current = cameraManager;

    async function initCamera() {
      try {
        setErrorType(null);
        const stream = await cameraManager.startCamera(facing);
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }

        // If rear camera and flash was enabled, activate hardware torch
        if (facing === 'environment' && flashEnabled) {
          await cameraManager.setTorch(true);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const error = err as Error;
        if (error.message === 'CAMERA_DENIED') setErrorType('camera_denied');
        else if (error.message === 'NO_CAMERA') setErrorType('no_camera');
        else setErrorType('camera_unavailable');
      }
    }

    initCamera();
    return () => {
      isMounted = false;
      cameraManager.stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing, cameraKey, stage]);

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  const restartCamera = () => setCameraKey((k) => k + 1);

  /** Capture one live slot: 1.8 s video + mid-point still */
  const performSingleLiveCapture = async (
    slotIdx: number,
    accumulated: LivePhotoSlot[],
    isRetake: boolean = false
  ) => {
    if (!videoRef.current || !cameraManagerRef.current) return;
    const stream = cameraManagerRef.current.getStream();
    if (!stream) return;

    setIsRecording(true);
    if (flashEnabled) {
      setFlashTriggered(true);
      setTimeout(() => setFlashTriggered(false), 200);
    }

    const capturingFacing = facing;
    const recorder = new MediaRecorderManager();
    mediaRecorderRef.current = recorder;
    recorder.startRecording(stream);

    let stillSnapshot: { blob: Blob; dataUrl: string } | null = null;
    const boost =
      capturingFacing === 'user' && ringLightConfig.enabled
        ? ringLightConfig.brightness / 100
        : flashEnabled
        ? 0.7
        : 0;

    setTimeout(async () => {
      try {
        if (videoRef.current) {
          stillSnapshot = await captureVideoFrame(videoRef.current, capturingFacing === 'user', boost);
        }
      } catch (err) {
        console.error('Still capture error', err);
      }
    }, 500);

    setTimeout(async () => {
      try {
        const recordResult = await recorder.stopRecording();
        if (!stillSnapshot && videoRef.current) {
          stillSnapshot = await captureVideoFrame(videoRef.current, capturingFacing === 'user', boost);
        }
        if (!stillSnapshot) return;

        const newSlot: LivePhotoSlot = {
          index: slotIdx,
          stillPhoto: stillSnapshot.blob,
          stillDataUrl: stillSnapshot.dataUrl,
          motionVideo: recordResult.blob,
          motionVideoUrl: recordResult.url,
          facingMode: capturingFacing,
        };

        if (isRetake) {
          const next = [...accumulated];
          const old = next[slotIdx];
          if (old?.stillDataUrl?.startsWith('blob:')) URL.revokeObjectURL(old.stillDataUrl);
          if (old?.motionVideoUrl?.startsWith('blob:')) URL.revokeObjectURL(old.motionVideoUrl);
          next[slotIdx] = newSlot;
          setCapturedSlots(next);
          setRetakingSlotIndex(null);
          setIsRecording(false);
          setStage('preview');
        } else {
          const next = [...accumulated, newSlot];
          setCapturedSlots(next);
          setIsRecording(false);
          const nextIdx = slotIdx + 1;
          if (nextIdx < totalSlots) {
            setCurrentSlotIndex(nextIdx);
            if (state.countdown > 0) startCountdownForSlot(nextIdx, next, false);
          } else {
            setStage('preview');
          }
        }
      } catch (err) {
        console.error('Live photo slot error', err);
        setIsRecording(false);
      }
    }, 1800);
  };

  /** Build framed composite strip and store result */
  const finalizeLivePhotoSession = async (slots: LivePhotoSlot[]) => {
    setIsProcessingFinal(true);
    try {
      const framedResult = await renderPhotostrip({
        photos: slots.map((s) => ({
          id: String(s.index),
          blob: s.stillPhoto,
          dataUrl: s.stillDataUrl,
          timestamp: Date.now(),
        })),
        frame: currentFrame,
      });

      const finalData: LivePhotoData = {
        stillPhoto: slots[0].stillPhoto,
        stillDataUrl: slots[0].stillDataUrl,
        motionVideo: slots[0].motionVideo,
        motionVideoUrl: slots[0].motionVideoUrl,
        framedStillBlob: framedResult.blob,
        framedStillDataUrl: framedResult.dataUrl,
        frame: currentFrame,
        slots,
        timestamp: Date.now(),
      };

      setLivePhoto(finalData);
      setLiveResult(finalData);
      setStage('result');
    } catch (err) {
      console.error('Finalize live photo error', err);
    } finally {
      setIsProcessingFinal(false);
    }
  };

  const startCountdownForSlot = (
    slotIdx: number,
    accumulated: LivePhotoSlot[],
    isRetake: boolean = false
  ) => {
    let count = state.countdown;
    setCountdownValue(count);
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
      } else {
        clearInterval(timer);
        setCountdownValue('SMILE!');
        setTimeout(() => {
          setCountdownValue(null);
          performSingleLiveCapture(slotIdx, accumulated, isRetake);
        }, 500);
      }
    }, 1000);
  };

  const handleCaptureLive = () => {
    if (isRecording || isProcessingFinal || !isCameraReady) return;
    if (retakingSlotIndex !== null) {
      if (state.countdown > 0) startCountdownForSlot(retakingSlotIndex, capturedSlots, true);
      else performSingleLiveCapture(retakingSlotIndex, capturedSlots, true);
      return;
    }
    if (state.countdown > 0) startCountdownForSlot(currentSlotIndex, capturedSlots, false);
    else performSingleLiveCapture(currentSlotIndex, capturedSlots, false);
  };

  const handleStartRetakeSlot = (slotIdx: number) => {
    setRetakingSlotIndex(slotIdx);
    restartCamera();
    setStage('capturing');
  };

  const handleCancelRetakeSlot = () => {
    setRetakingSlotIndex(null);
    setStage('preview');
  };

  const handleRetakeAll = () => {
    capturedSlots.forEach((s) => {
      if (s.stillDataUrl.startsWith('blob:')) URL.revokeObjectURL(s.stillDataUrl);
      if (s.motionVideoUrl.startsWith('blob:')) URL.revokeObjectURL(s.motionVideoUrl);
    });
    setCapturedSlots([]);
    setCurrentSlotIndex(0);
    setRetakingSlotIndex(null);
    setLiveResult(null);
    restartCamera();
    setStage('capturing');
  };

  // ── Error ───────────────────────────────────────────────────────────────────
  if (errorType) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
        <main className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            type={errorType}
            onRetry={() => {
              setErrorType(null);
              restartCamera();
            }}
            backHref="/frames"
          />
        </main>
      </div>
    );
  }

  // ── Stage: RESULT ───────────────────────────────────────────────────────────
  if (stage === 'result' && liveResult) {
    return (
      <LivePhotoResultPage
        data={liveResult}
        onRetake={handleRetakeAll}
        onCreateAnother={() => {
          resetSession();
          router.push('/mode');
        }}
      />
    );
  }

  // ── Stage: PREVIEW ──────────────────────────────────────────────────────────
  if (stage === 'preview') {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative overflow-x-hidden select-none bg-dot-pattern-blue">
        <BoothHeader
          backHref="/frames"
          badgeIcon={<Sparkles className="w-4 h-4 text-[#00327d]" />}
          badgeLabel="Pratinjau Live Photo"
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-10 flex flex-col items-center">
          <div className="text-center mb-5 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#00327d] tracking-tight font-['var(--font-bricolage)']">
              Pratinjau Live Photo
            </h1>
            <p className="text-xs sm:text-sm text-[#434653] font-medium mt-1.5 px-2">
              Klik foto untuk memutar motion. Ulangi foto yang kurang pas, lalu cetak.
            </p>
          </div>

          {/* Slot cards grid: proportional 1 or 2 cols on mobile, 3 on tablet/desktop */}
          <div
            className={`grid gap-3.5 sm:gap-6 w-full max-w-4xl mb-6 sm:mb-8 ${
              capturedSlots.length <= 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto'
                : 'grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {capturedSlots.map((slot, idx) => (
              <PreviewSlotCard
                key={idx}
                slot={slot}
                idx={idx}
                onRetake={() => handleStartRetakeSlot(idx)}
              />
            ))}
          </div>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
            <Button
              variant="outline"
              size="md"
              onClick={handleRetakeAll}
              className="w-full sm:flex-1 py-3 sm:py-3.5 text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Ulang Semua
            </Button>

            <Button
              variant="gold"
              size="lg"
              onClick={() => finalizeLivePhotoSession(capturedSlots)}
              isLoading={isProcessingFinal}
              className="w-full sm:flex-1 py-3 sm:py-3.5 text-sm sm:text-base"
            >
              <Sparkles className="w-5 h-5 text-[#00327d]" />
              Cetak
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ── Stage: CAPTURING ────────────────────────────────────────────────────────
  const isRingLightActive = facing === 'user' && ringLightConfig.enabled;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] relative overflow-x-hidden select-none bg-dot-pattern-blue">
      {/* Screen Ring Light Ambient Edge Illumination */}
      <RingLightOverlay config={ringLightConfig} />

      <BoothHeader
        backHref="/frames"
        onBack={() => retakingSlotIndex !== null && handleCancelRetakeSlot()}
        badgeIcon={<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00327d]" />}
        badgeLabel={
          retakingSlotIndex !== null
            ? `Ulangi Live #${retakingSlotIndex + 1}`
            : `Live Photo: ${currentFrame.name} (${Math.min(currentSlotIndex + 1, totalSlots)}/${totalSlots})`
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 flex flex-col items-center justify-center relative z-20">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start lg:items-center justify-center gap-3 sm:gap-6 lg:gap-8">

          {/* Controls: order-2 on mobile (below viewfinder), order-1 on desktop */}
          <div className="order-2 md:order-1 flex md:flex-col items-center justify-center shrink-0 w-full md:w-auto">
            <CameraControls
              countdown={state.countdown}
              onSelectCountdown={(sec: CountdownDuration) => setCountdown(sec)}
              onFlipCamera={handleFlipCamera}
              flashEnabled={flashEnabled}
              onToggleFlash={handleToggleFlash}
              facing={facing}
              disabled={isRecording}
            />
          </div>

          {/* Viewfinder */}
          <div className="order-1 md:order-2 flex flex-col items-center w-full max-w-[440px] lg:max-w-[560px] xl:max-w-2xl">
            <div
              className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-black border-3 sm:border-4 shadow-hard-blue transition-all duration-300 z-10"
              style={{
                borderColor: isRingLightActive ? ringLightConfig.color : '#00327d',
                boxShadow: isRingLightActive
                  ? `0 0 24px ${ringLightConfig.color}80, 4px 4px 0px 0px #00327d`
                  : undefined,
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facing === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              {flashTriggered && (
                <div
                  className="absolute inset-0 z-40 animate-out fade-out duration-300 pointer-events-none"
                  style={{ backgroundColor: ringLightConfig.color || '#ffffff' }}
                />
              )}

              {/* Status badge */}
              <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-[#00327d] text-[#fcd400] font-mono font-extrabold text-[10px] sm:text-xs border-2 border-[#fcd400] shadow-hard-gold-sm">
                {isRecording ? (
                  <>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>● MEREKAM MOTION...</span>
                  </>
                ) : retakingSlotIndex !== null ? (
                  <>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#fcd400]" />
                    <span>● ULANGI FOTO #{retakingSlotIndex + 1}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#fcd400]" />
                    <span>● LIVE READY</span>
                  </>
                )}
              </div>

              {/* Active Ring Light Status Pill */}
              {isRingLightActive && (
                <div
                  className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-extrabold border-2 border-[#00327d] shadow-sm select-none"
                  style={{ backgroundColor: ringLightConfig.color, color: '#00327d' }}
                >
                  <Sparkles className="w-3 h-3 fill-current animate-spin" />
                  <span>RING {ringLightConfig.brightness}%</span>
                </div>
              )}

              <CountdownOverlay currentCount={countdownValue} />
            </div>

            {/* Capture controls below viewfinder */}
            <div className="mt-3 sm:mt-6 flex flex-col items-center gap-2.5 sm:gap-3">
              <CaptureButton
                onClick={handleCaptureLive}
                disabled={!isCameraReady || isRecording}
                isCapturing={isRecording}
              />

              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-[#00327d] text-center px-2">
                  {isRecording
                    ? 'Tahan posemu sejenak, motion sedang direkam...'
                    : retakingSlotIndex !== null
                    ? `Ambil ulang Live Photo #${retakingSlotIndex + 1}`
                    : `Ambil Live Photo ${currentSlotIndex + 1} dari ${totalSlots}`}
                </p>
                {retakingSlotIndex !== null && !isRecording && (
                  <button
                    type="button"
                    onClick={handleCancelRetakeSlot}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#00327d] font-bold text-xs flex items-center gap-1 border border-[#00327d]/30"
                  >
                    Batal
                  </button>
                )}
              </div>

              {/* Manual advance when all slots captured */}
              {capturedSlots.length === totalSlots && !isRecording && retakingSlotIndex === null && (
                <button
                  type="button"
                  onClick={() => setStage('preview')}
                  className="mt-1 flex items-center gap-2 px-4 py-2 rounded-full bg-[#00327d] text-white font-extrabold text-xs sm:text-sm border-2 border-[#00327d] shadow-hard-blue-sm hover:bg-[#00327d]/90 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Lanjut ke Pratinjau</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Strip Preview - Shared Component (DRY) */}
          <div className="order-3 flex md:flex-col items-center shrink-0 w-full md:w-auto max-w-full">
            <StripPreview
              frame={currentFrame}
              photos={capturedSlots}
              currentPhotoIndex={retakingSlotIndex !== null ? retakingSlotIndex : currentSlotIndex}
              onSelectSlot={(idx) => !isRecording && handleStartRetakeSlot(idx)}
              onReset={capturedSlots.length > 0 && !isRecording ? handleRetakeAll : undefined}
              isRecording={isRecording}
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

// ── Preview slot card (extracted sub-component for DRY) ─────────────────────
interface PreviewSlotCardProps {
  slot: LivePhotoSlot;
  idx: number;
  onRetake: () => void;
}

function PreviewSlotCard({ slot, idx, onRetake }: PreviewSlotCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFront = slot.facingMode === 'user';

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.currentTime = 0;
      vid.play().catch((e) => console.warn('preview play error', e));
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-2 sm:border-[3px] border-[#00327d] shadow-hard-blue flex flex-col items-center">
      {/* Label row */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="font-extrabold text-xs sm:text-sm text-[#00327d] uppercase tracking-wider font-mono">
          Live #{idx + 1}
        </span>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <Check className="w-2.5 h-2.5" />
          Siap
        </span>
      </div>

      {/* Clickable media preview — shows still, plays motion on click */}
      <div
        onClick={togglePlay}
        className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-black border-2 border-[#00327d]/20 cursor-pointer mb-2.5 group"
      >
        {/* Still base */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slot.stillDataUrl}
          alt={`Live Photo ${idx + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-200 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Motion video overlay */}
        <video
          ref={videoRef}
          src={slot.motionVideoUrl}
          playsInline
          onEnded={() => setIsPlaying(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200
            ${isPlaying ? 'opacity-100' : 'opacity-0'}
            ${isFront ? 'scale-x-[-1]' : ''}`}
        />

        {/* Play / Pause overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors`}>
          <div className={`w-9 h-9 rounded-full bg-[#00327d]/85 text-[#fcd400] flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isPlaying
              ? <Pause className="w-4 h-4 fill-current" />
              : <Play className="w-4 h-4 fill-current ml-0.5" />
            }
          </div>
        </div>

        {/* LIVE badge */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fcd400] text-[#00327d] font-mono font-extrabold text-[9px] sm:text-[10px] border border-[#00327d]">
          <span className={`w-1.5 h-1.5 rounded-full bg-[#00327d] ${isPlaying ? 'animate-ping' : ''}`} />
          LIVE
        </div>
      </div>

      {/* Retake */}
      <Button variant="outline" size="sm" onClick={onRetake} className="w-full text-xs py-2 gap-1.5">
        <RefreshCw className="w-3.5 h-3.5" />
        Ulangi Live #{idx + 1}
      </Button>
    </div>
  );
}