import { FrameConfig } from '@/types/photobooth';

export const BUILTIN_FRAMES: FrameConfig[] = [
  {
    id: 'frame-01',
    name: 'Frame 01',
    subtitle: 'Vertical 3 Photos',
    photoCount: 3,
    width: 560,
    height: 1600,
    imageSrc: '/frames/frame-01.png',
    slots: [
      { x: 33, y: 40, width: 494, height: 424 },
      { x: 33, y: 506, width: 494, height: 424 },
      { x: 33, y: 971, width: 494, height: 415 },
    ],
  },
  {
    id: 'frame-02',
    name: 'Frame 02',
    subtitle: 'Grid 6 Photos',
    photoCount: 6,
    width: 1067,
    height: 1600,
    imageSrc: '/frames/frame-02.png',
    slots: [
      { x: 31, y: 47, width: 469, height: 392 },
      { x: 560, y: 47, width: 473, height: 397 },
      { x: 37, y: 493, width: 464, height: 397 },
      { x: 566, y: 497, width: 469, height: 401 },
      { x: 33, y: 934, width: 464, height: 401 },
      { x: 562, y: 943, width: 468, height: 405 },
    ],
  },
];

export function getFrameById(id: string, customFrame?: FrameConfig | null): FrameConfig {
  if (customFrame && customFrame.id === id) {
    return customFrame;
  }
  const found = BUILTIN_FRAMES.find((f) => f.id === id);
  return found || BUILTIN_FRAMES[0];
}

export function getAllFrames(customFrame?: FrameConfig | null): FrameConfig[] {
  if (customFrame) {
    return [...BUILTIN_FRAMES, customFrame];
  }
  return BUILTIN_FRAMES;
}
