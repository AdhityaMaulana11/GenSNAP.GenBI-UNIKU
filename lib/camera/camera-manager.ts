import { CameraFacing } from '@/types/photobooth';

export class CameraManager {
  private stream: MediaStream | null = null;
  private currentFacing: CameraFacing = 'user';

  async startCamera(
    facing: CameraFacing = 'user',
    idealResolution: { width?: number; height?: number } = { width: 1920, height: 1080 }
  ): Promise<MediaStream> {
    this.stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('BROWSER_UNSUPPORTED');
    }

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: facing },
        width: { ideal: idealResolution.width || 1920 },
        height: { ideal: idealResolution.height || 1080 },
      },
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentFacing = facing;
      return this.stream;
    } catch (err: unknown) {
      const error = err as Error;
      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        throw new Error('CAMERA_DENIED');
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        throw new Error('NO_CAMERA');
      } else if (
        error.name === 'NotReadableError' ||
        error.name === 'TrackStartError'
      ) {
        throw new Error('CAMERA_UNAVAILABLE');
      }
      throw error;
    }
  }

  async toggleFacing(): Promise<MediaStream> {
    const nextFacing: CameraFacing =
      this.currentFacing === 'user' ? 'environment' : 'user';
    return this.startCamera(nextFacing);
  }

  getFacing(): CameraFacing {
    return this.currentFacing;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }
  }
}
