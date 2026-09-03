import { FrameConfig, CapturedPhoto } from '@/types/photobooth';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + src));
    img.src = src;
  });
}

export interface RenderPhotostripOptions {
  photos: (CapturedPhoto | null)[];
  frame: FrameConfig;
}

export async function renderPhotostrip({
  photos,
  frame,
}: RenderPhotostripOptions): Promise<{ blob: Blob; dataUrl: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = frame.width;
  canvas.height = frame.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
  }

  // Draw pure white background behind cutouts
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 1. Draw each photo into its designated slot with object-fit: cover
  for (let i = 0; i < frame.slots.length; i++) {
    const slot = frame.slots[i];
    const photo = photos[i];

    if (photo && photo.dataUrl) {
      try {
        const photoImg = await loadImage(photo.dataUrl);
        const slotAspect = slot.width / slot.height;
        const imgAspect = photoImg.naturalWidth / photoImg.naturalHeight;

        let srcX = 0;
        let srcY = 0;
        let srcW = photoImg.naturalWidth;
        let srcH = photoImg.naturalHeight;

        if (imgAspect > slotAspect) {
          // Photo is wider than slot -> crop sides
          srcW = photoImg.naturalHeight * slotAspect;
          srcX = (photoImg.naturalWidth - srcW) / 2;
        } else {
          // Photo is taller than slot -> crop top/bottom
          srcH = photoImg.naturalWidth / slotAspect;
          srcY = (photoImg.naturalHeight - srcH) / 2;
        }

        // Slight 2px bleed under frame borders for seamless fit
        const bleed = 2;
        ctx.drawImage(
          photoImg,
          srcX,
          srcY,
          srcW,
          srcH,
          slot.x - bleed,
          slot.y - bleed,
          slot.width + bleed * 2,
          slot.height + bleed * 2
        );
      } catch (err) {
        console.error('Failed to draw photo slot ' + i, err);
      }
    }
  }

  // 2. Draw frame PNG artwork over the photos
  try {
    const frameImg = await loadImage(frame.imageSrc);
    ctx.drawImage(frameImg, 0, 0, frame.width, frame.height);
  } catch (err) {
    console.error('Failed to load frame artwork', err);
    throw new Error('FRAME_LOAD_FAILED');
  }

  // 3. Convert to Blob & Data URL
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_TO_BLOB_FAILED'));
          return;
        }
        const dataUrl = URL.createObjectURL(blob);
        resolve({ blob, dataUrl });
      },
      'image/png',
      1.0
    );
  });
}
