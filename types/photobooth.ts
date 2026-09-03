export type PhotoboothMode = 'photo' | 'live-photo' | 'video';

export type CountdownDuration = 3 | 5 | 10;

export type CameraFacing = 'user' | 'environment';

export interface FrameSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FrameConfig {
  id: string;
  name: string;
  subtitle?: string;
  photoCount: number;
  width: number;
  height: number;
  imageSrc: string;
  slots: FrameSlot[];
  isCustom?: boolean;
}

export interface CapturedPhoto {
  id: string;
  blob: Blob;
  dataUrl: string;
  timestamp: number;
  aspectRatio?: number;
}

export interface LivePhotoSlot {
  index: number;
  stillPhoto: Blob;
  stillDataUrl: string;
  motionVideo: Blob;
  motionVideoUrl: string;
  facingMode: CameraFacing;
}

export interface LivePhotoData {
  stillPhoto: Blob;
  stillDataUrl: string;
  motionVideo?: Blob;
  motionVideoUrl?: string;
  framedStillBlob?: Blob;
  framedStillDataUrl?: string;
  frame?: FrameConfig;
  slots?: LivePhotoSlot[];
  timestamp: number;
}

export interface VideoRecordData {
  videoBlob: Blob;
  videoUrl: string;
  durationMs: number;
  timestamp: number;
}

export interface PhotoboothSessionState {
  mode: PhotoboothMode;
  selectedFrameId: string;
  customFrame: FrameConfig | null;
  countdown: CountdownDuration;
  photos: (CapturedPhoto | null)[];
  currentPhotoIndex: number;
  finalImageBlob: Blob | null;
  finalImageDataUrl: string | null;
  livePhoto: LivePhotoData | null;
  videoRecord: VideoRecordData | null;
  isRetaking: boolean;
  retakeIndex: number | null;
}