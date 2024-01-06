
export interface SliderMarkers {
  start: number;
  time: number;
  end: number;
}

export type SliderMarkerType = 'start' | 'time' | 'end';

export interface VideoMetadata {
  isInitiallyLoading: boolean;
  duration: number;
  paused: boolean;
}

