'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Download, RefreshCw, Camera, Play, Pause, Square } from 'lucide-react';
import { CameraManager } from '@/lib/camera/camera-manager';
import { MediaRecorderManager } from '@/lib/media/media-recorder-manager';
import { Button } from '@/components/ui/button';
import { BoothHeader } from '@/components/layout/booth-header';
import { ErrorState, ErrorType } from '@/components/ui/error-state';
import { triggerDownload } from '@/lib/export/export-manager';
import { usePhotoboothSession } from '@/lib/session/session-context';
import { CameraFacing, VideoRecordData } from '@/types/photobooth';

const MAX_VIDEO_DURATION_SEC = 15;

export default function VideoBoothPage() {
  const router = useRouter();
  const { resetSession } = usePhotoboothSession();

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const mediaRecorderRef = useRef<MediaRecorderManager | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [facing] = useState<CameraFacing>('user');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [videoResult, setVideoResult] = useState<VideoRecordData | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [isPlayingResult, setIsPlayingResult] = useState(false);

  useEffect(() => {
    if (videoResult) return;
    let isMounted = true;

    async function initCamera() {
      if (!cameraManagerRef.current) {
        cameraManagerRef.current = new CameraManager();
      }

      try {
        const stream = await cameraManagerRef.current.startCamera(facing);
        if (!isMounted) return;

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.onloadedmetadata = () => {
            if (isMounted) {
              videoPreviewRef.current?.play();
              setIsCameraReady(true);
            }
          };
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const error = err as Error;
        if (error.message === 'CAMERA_DENIED') {
          setErrorType('camera_denied');
        } else if (error.message === 'NO_CAMERA') {
          setErrorType('no_camera');
        } else {
          setErrorType('camera_unavailable');
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      cameraManagerRef.current?.stopCamera();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [facing, videoResult]);

  const handleStartRecording = () => {
    const stream = cameraManagerRef.current?.getStream();
    if (!stream || isRecording) return;

    if (!mediaRecorderRef.current) {
      mediaRecorderRef.current = new MediaRecorderManager();
    }

    mediaRecorderRef.current.startRecording(stream);
    setIsRecording(true);
    setElapsedSec(0);

    let sec = 0;
    timerIntervalRef.current = setInterval(() => {
      sec += 1;
      setElapsedSec(sec);
      if (sec >= MAX_VIDEO_DURATION_SEC) {
        handleStopRecording();
      }
    }, 1000);
  };

  const handleStopRecording = async () => {
    if (!isRecording) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setIsRecording(false);

    try {
      const { blob, url } = await mediaRecorderRef.current!.stopRecording();
      cameraManagerRef.current?.stopCamera();
      setIsCameraReady(false);

      setVideoResult({
        videoBlob: blob,
        videoUrl: url,
        durationMs: elapsedSec * 1000,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Stop recording error:', err);
    }
  };

  const handleDownloadVideo = () => {
    if (videoResult) {
      triggerDownload(videoResult.videoBlob, `GenSNAP-video-${Date.now()}.mp4`);
    }
  };

  const toggleResultPlayback = () => {
    if (!playbackRef.current) return;
    if (isPlayingResult) {
      playbackRef.current.pause();
      setIsPlayingResult(false);
    } else {
      playbackRef.current.currentTime = 0;
      playbackRef.current.play();
      setIsPlayingResult(true);
    }
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
            }}
            backHref="/mode"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] bg-dot-pattern select-none overflow-x-hidden">
      <BoothHeader
        backHref="/mode"
        badgeIcon={<Video className="w-4 h-4 text-[#00327d]" />}
        badgeLabel="Video Booth (Maks. 15d)"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 flex flex-col items-center justify-center">
        {videoResult ? (
          /* Video Playback & Download Result Screen */
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 max-w-4xl">
            <div className="flex flex-col items-center shrink-0">
              <div
                onClick={toggleResultPlayback}
                className="relative w-[300px] sm:w-[380px] md:w-[420px] lg:w-[460px] aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 border-[#00327d] shadow-hard-blue cursor-pointer group"
              >
                <video
                  ref={playbackRef}
                  src={videoResult.videoUrl}
                  playsInline
                  onEnded={() => setIsPlayingResult(false)}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#00327d]/90 text-[#fcd400] border-2 border-[#fcd400] flex items-center justify-center shadow-hard-blue-sm">
                    {isPlayingResult ? (
                      <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    )}
                  </div>
                </div>

                <div className="absolute bottom-3 inset-x-0 text-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Klik untuk memutar video
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-4 w-full max-w-sm">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#00327d] shadow-hard-blue flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownloadVideo}
                  className="w-full py-3.5 text-base"
                >
                  <Download className="w-5 h-5 text-[#fcd400]" />
                  Download Video (.MP4)
                </Button>

                <div className="w-full h-px bg-[#c3c6d5] my-1" />

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setVideoResult(null)}
                    className="w-full text-xs sm:text-sm py-2.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Rekam Ulang
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      resetSession();
                      router.push('/mode');
                    }}
                    className="w-full text-xs sm:text-sm py-2.5"
                  >
                    <Camera className="w-4 h-4" />
                    Mode Lain
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Recording Screen */
          <div className="flex flex-col items-center w-full max-w-[480px] md:max-w-[540px] lg:max-w-2xl">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black border-4 border-[#00327d] shadow-hard-blue flex items-center justify-center">
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facing === 'user' ? 'scale-x-[-1]' : 'scale-x-100'
                }`}
              />

              {/* Recording Status & Timer */}
              {isRecording ? (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ba1a1a] text-white font-mono font-bold text-xs border-2 border-white shadow-hard-dark animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>REC {elapsedSec}s / {MAX_VIDEO_DURATION_SEC}s</span>
                </div>
              ) : (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00327d] text-[#fcd400] font-mono font-extrabold text-[11px] sm:text-xs border-2 border-[#fcd400] shadow-hard-gold-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fcd400]" />
                  <span>● VIDEO READY</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  aria-label="Stop Recording"
                  className="flex items-center justify-center w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#ba1a1a] border-4 border-[#00327d] shadow-hard-blue hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <Square className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isCameraReady}
                  onClick={handleStartRecording}
                  aria-label="Start Recording"
                  className="group relative flex items-center justify-center w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#fcd400] border-4 border-[#00327d] shadow-hard-blue hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#ba1a1a] flex items-center justify-center text-white">
                    <Video className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </button>
              )}

              <p className="text-xs sm:text-sm font-bold text-[#00327d] text-center">
                {isRecording
                  ? `Merekam... Klik tombol untuk berhenti (Maks. ${MAX_VIDEO_DURATION_SEC} detik)`
                  : 'Klik tombol merah untuk mulai merekam video'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
