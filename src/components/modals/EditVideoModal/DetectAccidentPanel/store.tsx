import { create } from "zustand";
import { FramePredictions, PredictionBoxIndexes, AccidentDetectionModelProgress } from "./types";

interface CompletionState {
  loadingText: string;
  loadingProgress: AccidentDetectionModelProgress;
  isPredictionDone: boolean;
  isLoadingDone: boolean;
  isFrameTransitionDone: boolean;
}

interface CompletionAction {
  setLoadingText: (loadingText: string) => void;
  setLoadingProgress: (progress: AccidentDetectionModelProgress) => void;
  setIsPredictionDone: (isPredictionDone: boolean) => void;
  setIsLoadingDone: (isLoadingDone: boolean) => void;
  setIsFrameTransitionDone: (isFrameTransitionDone: boolean) => void;
}

interface ThresholdState {
  confidenceThreshold: number;
  iouThreshold: number;
}

interface ThresholdAction {
  setConfidenceThreshold: (confidenceThreshold: number) => void;
  setIouThreshold: (iouThreshold: number) => void;
}

interface OutputState {
  allPredictions: FramePredictions[];
  selectedFrameIndex: number;
  bestPredictionBoxIndexes: PredictionBoxIndexes
}

interface OutputAction {
  addFramePredictions: (framePredictions: FramePredictions) => void;
  clearPredictions: () => void;
  getFrameCount: () => number;
  getSelectedFramePredictions: () => FramePredictions;
  setSelectedFrameIndex: (selectedFrameIndex: number) => void;
  setBestPredictionBoxIndexes: (bestPredictionBoxIndexes: PredictionBoxIndexes) => void;
}

interface hiddenPredictionBoxIndexesState {
  hiddenPredictionBoxIndexes: Set<number>
}

interface hiddenPredictionBoxIndexesAction {
  clearHiddenPredictionBoxIndexes: () => void;
  toggleHiddenPredictionBoxIndex: (index: number) => void;
}

interface PanelAction {
  resetModelStates: () => void;
}

type DetectAccidentPanelState = CompletionState & ThresholdState & OutputState & hiddenPredictionBoxIndexesState;
type DetectAccidentPanelAction = CompletionAction & ThresholdAction & OutputAction & hiddenPredictionBoxIndexesAction & PanelAction;
type DetectAccidentPanelStore = DetectAccidentPanelState & DetectAccidentPanelAction;

const defaultState: DetectAccidentPanelState = {
  loadingText: "",
  loadingProgress: {
    percent: 0,
    displayText: "0%"
  },
  isPredictionDone: false,
  isLoadingDone: false,
  isFrameTransitionDone: false,
  confidenceThreshold: 50,
  iouThreshold: 50,
  allPredictions: [],
  selectedFrameIndex: 0,
  bestPredictionBoxIndexes: {
    frameIndex: -1,
    boxIndex: -1
  },
  hiddenPredictionBoxIndexes: new Set<number>(),
};

const useDetectAccidentPanelStore = create<DetectAccidentPanelStore>((set, get) => ({
  ...defaultState,

  setLoadingText: (loadingText: string) => set({ loadingText }),
  setLoadingProgress:(loadingProgress: AccidentDetectionModelProgress) => set({ loadingProgress }),
  setIsPredictionDone: (isPredictionDone: boolean) => set({ isPredictionDone }),
  setIsLoadingDone: (isLoadingDone: boolean) => set({ isLoadingDone }),
  setIsFrameTransitionDone: (isFrameTransitionDone: boolean) => set({ isFrameTransitionDone }),

  setConfidenceThreshold: (confidenceThreshold: number) => set({ confidenceThreshold }),
  setIouThreshold: (iouThreshold: number) => set({ iouThreshold }),

  addFramePredictions: (framePredictions: FramePredictions) => set((state) => ({
    allPredictions: [ ...state.allPredictions, framePredictions ]
  })),
  clearPredictions: () => set({ allPredictions: [] }),
  getFrameCount: () => get().allPredictions.length,
  getSelectedFramePredictions: () => get().allPredictions[get().selectedFrameIndex],
  setSelectedFrameIndex: (selectedFrameIndex: number) => set({ selectedFrameIndex }),
  setBestPredictionBoxIndexes: (bestPredictionBoxIndexes: PredictionBoxIndexes) => set({ bestPredictionBoxIndexes }),

  clearHiddenPredictionBoxIndexes: () => set({ hiddenPredictionBoxIndexes: new Set<number>() }),
  toggleHiddenPredictionBoxIndex: (index: number) => set((state) => {
    const newHiddenPredictionBoxIndexes = state.hiddenPredictionBoxIndexes;
    if (state.hiddenPredictionBoxIndexes.has(index)) {
      newHiddenPredictionBoxIndexes.delete(index);
    } else {
      newHiddenPredictionBoxIndexes.add(index);
    }

    return { hiddenPredictionBoxIndexes: new Set(newHiddenPredictionBoxIndexes) }
  }),
  
  resetModelStates: () => set({ ...defaultState })
}));

export default useDetectAccidentPanelStore;