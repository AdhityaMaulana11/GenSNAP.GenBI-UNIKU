'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import {
  PhotoboothMode,
  CountdownDuration,
  FrameConfig,
  CapturedPhoto,
  LivePhotoData,
  VideoRecordData,
  PhotoboothSessionState,
} from '@/types/photobooth';
import { BUILTIN_FRAMES, getFrameById } from '@/lib/frames/frames';

const initialFrame = BUILTIN_FRAMES[0];

const initialState: PhotoboothSessionState = {
  mode: 'photo',
  selectedFrameId: initialFrame.id,
  customFrame: null,
  countdown: 3,
  photos: [null, null, null],
  currentPhotoIndex: 0,
  finalImageBlob: null,
  finalImageDataUrl: null,
  livePhoto: null,
  videoRecord: null,
  isRetaking: false,
  retakeIndex: null,
};

type SessionAction =
  | { type: 'SET_MODE'; payload: PhotoboothMode }
  | { type: 'SET_FRAME'; payload: string }
  | { type: 'SET_CUSTOM_FRAME'; payload: FrameConfig }
  | { type: 'SET_COUNTDOWN'; payload: CountdownDuration }
  | { type: 'ADD_PHOTO'; payload: CapturedPhoto }
  | { type: 'REPLACE_PHOTO'; payload: { index: number; photo: CapturedPhoto } }
  | { type: 'START_RETAKE'; payload: number }
  | { type: 'CANCEL_RETAKE' }
  | { type: 'SET_FINAL_IMAGE'; payload: { blob: Blob; dataUrl: string } }
  | { type: 'SET_LIVE_PHOTO'; payload: LivePhotoData }
  | { type: 'SET_VIDEO_RECORD'; payload: VideoRecordData }
  | { type: 'RESET_SESSION' };

function sessionReducer(
  state: PhotoboothSessionState,
  action: SessionAction
): PhotoboothSessionState {
  switch (action.type) {
    case 'SET_MODE': {
      return {
        ...state,
        mode: action.payload,
      };
    }
    case 'SET_FRAME': {
      const targetFrame = getFrameById(action.payload, state.customFrame);
      const newPhotoArray = new Array(targetFrame.photoCount).fill(null);
      // Clean up previous photo object URLs if changing frame
      state.photos.forEach((p) => {
        if (p?.dataUrl && p.dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.dataUrl);
        }
      });
      return {
        ...state,
        selectedFrameId: action.payload,
        photos: newPhotoArray,
        currentPhotoIndex: 0,
        finalImageBlob: null,
        finalImageDataUrl: null,
        isRetaking: false,
        retakeIndex: null,
      };
    }
    case 'SET_CUSTOM_FRAME': {
      const newPhotoArray = new Array(action.payload.photoCount).fill(null);
      state.photos.forEach((p) => {
        if (p?.dataUrl && p.dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.dataUrl);
        }
      });
      return {
        ...state,
        customFrame: action.payload,
        selectedFrameId: action.payload.id,
        photos: newPhotoArray,
        currentPhotoIndex: 0,
        finalImageBlob: null,
        finalImageDataUrl: null,
        isRetaking: false,
        retakeIndex: null,
      };
    }
    case 'SET_COUNTDOWN': {
      return {
        ...state,
        countdown: action.payload,
      };
    }
    case 'ADD_PHOTO': {
      const nextPhotos = [...state.photos];
      nextPhotos[state.currentPhotoIndex] = action.payload;
      return {
        ...state,
        photos: nextPhotos,
        currentPhotoIndex: Math.min(
          state.currentPhotoIndex + 1,
          state.photos.length
        ),
      };
    }
    case 'REPLACE_PHOTO': {
      const nextPhotos = [...state.photos];
      // revoke replaced photo url
      const old = nextPhotos[action.payload.index];
      if (old?.dataUrl && old.dataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(old.dataUrl);
      }
      nextPhotos[action.payload.index] = action.payload.photo;
      return {
        ...state,
        photos: nextPhotos,
        isRetaking: false,
        retakeIndex: null,
      };
    }
    case 'START_RETAKE': {
      return {
        ...state,
        isRetaking: true,
        retakeIndex: action.payload,
      };
    }
    case 'CANCEL_RETAKE': {
      return {
        ...state,
        isRetaking: false,
        retakeIndex: null,
      };
    }
    case 'SET_FINAL_IMAGE': {
      if (state.finalImageDataUrl && state.finalImageDataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.finalImageDataUrl);
      }
      return {
        ...state,
        finalImageBlob: action.payload.blob,
        finalImageDataUrl: action.payload.dataUrl,
      };
    }
    case 'SET_LIVE_PHOTO': {
      return {
        ...state,
        livePhoto: action.payload,
      };
    }
    case 'SET_VIDEO_RECORD': {
      return {
        ...state,
        videoRecord: action.payload,
      };
    }
    case 'RESET_SESSION': {
      // Revoke all created URLs
      state.photos.forEach((p) => {
        if (p?.dataUrl && p.dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.dataUrl);
        }
      });
      if (state.finalImageDataUrl && state.finalImageDataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.finalImageDataUrl);
      }
      if (state.livePhoto?.stillDataUrl && state.livePhoto.stillDataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.livePhoto.stillDataUrl);
      }
      if (state.livePhoto?.motionVideoUrl && state.livePhoto.motionVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.livePhoto.motionVideoUrl);
      }
      if (state.videoRecord?.videoUrl && state.videoRecord.videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.videoRecord.videoUrl);
      }

      const defaultFrame = BUILTIN_FRAMES[0];
      return {
        ...initialState,
        selectedFrameId: defaultFrame.id,
        photos: new Array(defaultFrame.photoCount).fill(null),
      };
    }
    default:
      return state;
  }
}

interface SessionContextValue {
  state: PhotoboothSessionState;
  currentFrame: FrameConfig;
  setMode: (mode: PhotoboothMode) => void;
  setFrame: (frameId: string) => void;
  setCustomFrame: (frame: FrameConfig) => void;
  setCountdown: (countdown: CountdownDuration) => void;
  addPhoto: (photo: CapturedPhoto) => void;
  replacePhoto: (index: number, photo: CapturedPhoto) => void;
  startRetake: (index: number) => void;
  cancelRetake: () => void;
  setFinalImage: (blob: Blob, dataUrl: string) => void;
  setLivePhoto: (data: LivePhotoData) => void;
  setVideoRecord: (data: VideoRecordData) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function PhotoboothProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      const currentState = stateRef.current;
      currentState.photos.forEach((p) => {
        if (p?.dataUrl && p.dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.dataUrl);
        }
      });
      if (currentState.finalImageDataUrl && currentState.finalImageDataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentState.finalImageDataUrl);
      }
    };
  }, []);

  const currentFrame = getFrameById(state.selectedFrameId, state.customFrame);

  const value: SessionContextValue = {
    state,
    currentFrame,
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setFrame: (frameId) => dispatch({ type: 'SET_FRAME', payload: frameId }),
    setCustomFrame: (frame) => dispatch({ type: 'SET_CUSTOM_FRAME', payload: frame }),
    setCountdown: (countdown) => dispatch({ type: 'SET_COUNTDOWN', payload: countdown }),
    addPhoto: (photo) => dispatch({ type: 'ADD_PHOTO', payload: photo }),
    replacePhoto: (index, photo) => dispatch({ type: 'REPLACE_PHOTO', payload: { index, photo } }),
    startRetake: (index) => dispatch({ type: 'START_RETAKE', payload: index }),
    cancelRetake: () => dispatch({ type: 'CANCEL_RETAKE' }),
    setFinalImage: (blob, dataUrl) => dispatch({ type: 'SET_FINAL_IMAGE', payload: { blob, dataUrl } }),
    setLivePhoto: (data) => dispatch({ type: 'SET_LIVE_PHOTO', payload: data }),
    setVideoRecord: (data) => dispatch({ type: 'SET_VIDEO_RECORD', payload: data }),
    resetSession: () => dispatch({ type: 'RESET_SESSION' }),
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function usePhotoboothSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('usePhotoboothSession must be used within a PhotoboothProvider');
  }
  return context;
}
