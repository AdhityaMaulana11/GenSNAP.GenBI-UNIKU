import { CapturedPhoto } from '@/types/photobooth';

export async function captureVideoFrame(
  videoElement: HTMLVideoElement,
  mirror: boolean = false
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

  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

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
