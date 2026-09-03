function getFormattedTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const sec = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hour}${min}${sec}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPNG(blob: Blob, prefix: string = 'GenSNAP-photo'): void {
  const filename = `${prefix}-${getFormattedTimestamp()}.png`;
  triggerDownload(blob, filename);
}

export async function downloadJPG(
  imageBlobOrUrl: Blob | string,
  prefix: string = 'GenSNAP-photo'
): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  const srcUrl =
    typeof imageBlobOrUrl === 'string'
      ? imageBlobOrUrl
      : URL.createObjectURL(imageBlobOrUrl);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('CANVAS_CONTEXT_UNAVAILABLE'));
        return;
      }
      // Fill white background for JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (jpegBlob) => {
          if (typeof imageBlobOrUrl !== 'string') {
            URL.revokeObjectURL(srcUrl);
          }
          if (jpegBlob) {
            const filename = `${prefix}-${getFormattedTimestamp()}.jpg`;
            triggerDownload(jpegBlob, filename);
            resolve();
          } else {
            reject(new Error('JPEG_CONVERSION_FAILED'));
          }
        },
        'image/jpeg',
        0.95
      );
    };

    img.onerror = () => {
      if (typeof imageBlobOrUrl !== 'string') {
        URL.revokeObjectURL(srcUrl);
      }
      reject(new Error('IMAGE_LOAD_FAILED'));
    };

    img.src = srcUrl;
  });
}

export async function shareImage(
  blob: Blob,
  title: string = 'GenSNAP Photobooth',
  text: string = 'Kenanganku bersama GenBI UNIKU! #GenSNAP'
): Promise<boolean> {
  const filename = `GenSNAP-photo-${getFormattedTimestamp()}.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title,
        text,
      });
      return true;
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Share error:', err);
      }
      return false;
    }
  }

  // Fallback to direct download
  downloadPNG(blob);
  return false;
}
