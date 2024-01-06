import { create } from "zustand";


interface ModalState {
  isOpen: boolean;
  videoPath: string;
  selectedTabIndex: number;
  areTabsDisabled: boolean;
}
interface ModalAction {
  openModal: (videoPath: string) => void;
  closeModal: () => void;
  selectTab: (index: number) => void;
  setTabsDisabledState: (areTabsDisabled: boolean) => void;
}
interface SliderMarkers {
  start: number;
  time: number;
  end: number;
}

export type SliderMarkerType = 'start' | 'time' | 'end';
interface SliderState {
  sliderMarkers: SliderMarkers;
}
interface SliderAction {
  setSliderMarkers: (sliderMarkers: SliderMarkers) => void;
  setStartMarker: (value: number) => void;
  setTimeMarker: (value: number) => void;
  setEndMarker: (value: number) => void;
  setDynamicMarker: (type: SliderMarkerType, value: number) => void;
}
interface VideoMetadata {
  isInitiallyLoading: boolean;
  duration: number;
  paused: boolean;
}
interface VideoMetadataState {
  videoMetadata: VideoMetadata;
}
interface VideoMetadataAction {
  finishInitialVideoLoading: (duration: number) => void;
  setVideoMetadata: (videoMetadata: VideoMetadata) => void;
  playVideo: () => void;
  pauseVideo: () => void;
}
type EditVideoModalState = ModalState & SliderState & VideoMetadataState;
type EditVideoModalAction = ModalAction & SliderAction & VideoMetadataAction;
type EditVideoModalStore = EditVideoModalState & EditVideoModalAction;
const defaultState: EditVideoModalState = {
  isOpen: false,
  videoPath: '',
  selectedTabIndex: 0,
  areTabsDisabled: false,
  sliderMarkers: {
    start: 0,
    time: 0,
    end: 0,
  },
  videoMetadata: {
    isInitiallyLoading: true,
    duration: 0,
    paused: true,
  }
};
const useEditVideoModalStore = create<EditVideoModalStore>((set) => ({
  ...defaultState,

  openModal: (videoPath: string) => set({
    isOpen: true,
    videoPath,
  }),
  closeModal: () => set({
    ...defaultState,
  }),

  selectTab: (index: number) => set({ selectedTabIndex: index }),
  setTabsDisabledState: (areTabsDisabled: boolean) => set({ areTabsDisabled }),

  setSliderMarkers: (newSliderMarkers: SliderMarkers) => set({ sliderMarkers: newSliderMarkers }),
  setStartMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, start: value } })),
  setTimeMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, time: value } })),
  setEndMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, end: value } })),
  setDynamicMarker: (type: SliderMarkerType, value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, [type]: value } })),

  finishInitialVideoLoading: (duration: number) => set({ videoMetadata: { paused: true, isInitiallyLoading: false, duration } }),
  setVideoMetadata: (videoMetadata: VideoMetadata) => set({ videoMetadata }),
  playVideo: () => set((state) => ({ videoMetadata: { ...state.videoMetadata, paused: false } })),
  pauseVideo: () => set((state) => ({ videoMetadata: { ...state.videoMetadata, paused: true } })),
}));
export default useEditVideoModalStore;
