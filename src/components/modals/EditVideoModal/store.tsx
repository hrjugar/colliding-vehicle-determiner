import { create } from "zustand";
import { SliderMarkers } from "./types";
import { SliderMarkerType } from "./types";

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

interface ChangeState {
  isTrimmedPortionChanged: boolean;
  isAccidentDetectionModelChanged: boolean;
}

interface ChangeAction {
  setIsTrimmedPortionChanged: (isTrimmedPortionChanged: boolean) => void;
  setIsAccidentDetectionModelChanged: (isAccidentModelChanged: boolean) => void;
}

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
interface VideoMetadataState {
  isVideoInitiallyLoading: boolean;
  isPaused: boolean;
  videoDuration: number;
  fps: number;
}

interface VideoMetadataAction {
  finishInitialVideoLoading: (duration: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setFps: (fps: number) => void;
}

type EditVideoModalState = ModalState & ChangeState & SliderState & VideoMetadataState;
type EditVideoModalAction = ModalAction & ChangeAction & SliderAction & VideoMetadataAction;
type EditVideoModalStore = EditVideoModalState & EditVideoModalAction;
const defaultState: EditVideoModalState = {
  isOpen: false,
  videoPath: '',
  selectedTabIndex: 0,
  areTabsDisabled: false,
  isTrimmedPortionChanged: false,
  isAccidentDetectionModelChanged: false,
  sliderMarkers: {
    start: 0,
    time: 0,
    end: 0,
  },
  isVideoInitiallyLoading: true,
  isPaused: true,
  videoDuration: 0,
  fps: 24
};

const useEditVideoModalStore = create<EditVideoModalStore>((set) => ({
  ...defaultState,

  openModal: (videoPath: string) => set({
    isOpen: true,
    videoPath,
    isTrimmedPortionChanged: true
  }),
  closeModal: () => set({
    ...defaultState,
  }),

  selectTab: (index: number) => set({ selectedTabIndex: index }),
  setTabsDisabledState: (areTabsDisabled: boolean) => set({ areTabsDisabled }),

  setIsTrimmedPortionChanged: (isTrimmedPortionChanged: boolean) => set({ isTrimmedPortionChanged }),
  setIsAccidentDetectionModelChanged: (isAccidentDetectionModelChanged: boolean) => set({ isAccidentDetectionModelChanged }),

  setSliderMarkers: (newSliderMarkers: SliderMarkers) => set({ sliderMarkers: newSliderMarkers }),
  setStartMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, start: value }, isTrimmedPortionChanged: true })),
  setTimeMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, time: value } })),
  setEndMarker: (value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, end: value }, isTrimmedPortionChanged: true })),
  setDynamicMarker: (type: SliderMarkerType, value: number) => set((state) => ({ sliderMarkers: { ...state.sliderMarkers, [type]: value } })),

  finishInitialVideoLoading: (duration: number) => set({ isPaused: true, isVideoInitiallyLoading: false, videoDuration: duration }),
  playVideo: () => set(({ isPaused: false })),
  pauseVideo: () => set(({ isPaused: true })),
  setFps: (fps: number) => set({ fps })
}));
export default useEditVideoModalStore;
