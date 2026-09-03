import { CapturedPhoto } from '@/types/photobooth';

export interface CaptureOptions {
  mirror?: boolean;
  brightnessBoost?: number; // 0.0 to 1.0 (based on ring light brightness / flash intensity)
  colorWarmth?: string;
}

export async function captureVideoFrame(
  videoElement: HTMLVideoElement,
  mirror: boolean = false,
  brightnessBoost: number = 0
): Promise<CapturedPhoto> {
  const videoWidth = videoElement.videoWidth || 1280;
  const videoHeight = videoElement.videoHeight || 720;

  const canvas = document.createElement('canvas');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
  }

  // Apply exposure / lighting boost if ring light or flash was enabled
  if (brightnessBoost > 0) {
    const bFactor = 1 + Math.min(0.4, brightnessBoost * 0.35); // up to 1.35x brightness
    const cFactor = 1 + Math.min(0.12, brightnessBoost * 0.1);  // up to 1.10x contrast
    ctx.filter = `brightness(${bFactor.toFixed(2)}) contrast(${cFactor.toFixed(2)})`;
  }

  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

  // Reset filter
  ctx.filter = 'none';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_TO_BLOB_FAILED'));
          return;
        }
        const dataUrl = URL.createObjectURL(blob);
        resolve({
          id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          blob,
          dataUrl,
          timestamp: Date.now(),
          aspectRatio: videoWidth / videoHeight,
        });
      },
      'image/jpeg',
      0.98
    );
  });
}
