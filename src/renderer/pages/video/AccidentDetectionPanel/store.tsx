import { create } from "zustand";

interface CompletionState {
  isPredictionDone: boolean;
  isLoadingDone: boolean;
}

interface CompletionAction {
  setIsPredictionDone: (isPredictionDone: boolean) => void;
  setIsLoadingDone: (isLoadingDone: boolean) => void;
}

interface OutputState {
  allPredictions: BoundingBoxWithConfidence[][];
  selectedFrameIndex: number;
  bestPredictionBoxIndexes: PredictionBoxIndexes
}

interface OutputAction {
  getFrameCount: () => number;
  setAllPredictions: (allPredictions: BoundingBoxWithConfidence[][]) => void;
  setSelectedFrameIndex: (selectedFrameIndex: number) => void;
  getSelectedFramePredictions: () => BoundingBoxWithConfidence[];
  setBestPredictionBoxIndexes: (bestPredictionBoxIndexes: PredictionBoxIndexes) => void;
}

interface BoxVisibilityState {
  hiddenPredictionBoxIndexes: Set<number>
}

interface BoxVisibilityAction {
  toggleHiddenPredictionBoxIndex: (index: number) => void;
  clearHiddenPredictionBoxIndexes: () => void;
}

interface PanelAction {
  resetStates: () => void;
}

type AccidentDetectionPanelState = CompletionState & OutputState & BoxVisibilityState;
type AccidentDetectionPanelAction = CompletionAction & OutputAction & PanelAction & BoxVisibilityAction;
type AccidentDetectionPanelStore = AccidentDetectionPanelState & AccidentDetectionPanelAction;

const defaultState: AccidentDetectionPanelState = {
  isPredictionDone: false,
  isLoadingDone: false,
  allPredictions: [],
  selectedFrameIndex: 0,
  bestPredictionBoxIndexes: {
    frameIndex: 0,
    boxIndex: 0
  },
  hiddenPredictionBoxIndexes: new Set<number>()
};

const useAccidentDetectionPanelStore = create<AccidentDetectionPanelStore>((set, get) => ({
  ...defaultState,

  setIsPredictionDone: (isPredictionDone: boolean) => set({ isPredictionDone }),
  setIsLoadingDone: (isLoadingDone: boolean) => set({ isLoadingDone }),

  getFrameCount: () => get().allPredictions.length,
  setAllPredictions: (allPredictions: BoundingBoxWithConfidence[][]) => set({ allPredictions }),
  setSelectedFrameIndex: (selectedFrameIndex: number) => set({ selectedFrameIndex }),
  getSelectedFramePredictions: () => get().allPredictions[get().selectedFrameIndex],
  setBestPredictionBoxIndexes: (bestPredictionBoxIndexes: PredictionBoxIndexes) => set({ bestPredictionBoxIndexes }),

  toggleHiddenPredictionBoxIndex: (index: number) => set((state) => {
    const newHiddenPredictionBoxIndexes = new Set(state.hiddenPredictionBoxIndexes);
    if (newHiddenPredictionBoxIndexes.has(index)) {
      newHiddenPredictionBoxIndexes.delete(index);
    } else {
      newHiddenPredictionBoxIndexes.add(index);
    }

    return {
      hiddenPredictionBoxIndexes: newHiddenPredictionBoxIndexes
    };
  }),
  clearHiddenPredictionBoxIndexes: () => set({ hiddenPredictionBoxIndexes: new Set<number>() }),

  resetStates: () => set(defaultState)
}));

export default useAccidentDetectionPanelStore;