import { create } from "zustand";

interface EndPanelState {
  loadingText: string;
  loadingProgress: Progress;
  isLoadingDone: boolean;
  isPredictionDone: boolean;
}

interface EndPanelAction {
  setLoadingText: (loadingText: string) => void;
  setLoadingProgress: (loadingProgress: Progress) => void;
  setIsLoadingDone: (isLoadingDone: boolean) => void;
  setIsPredictionDone: (isPredictionDone: boolean) => void;
  resetStates: () => void;
}

type EndPanelStore = EndPanelState & EndPanelAction;

const defaultState: EndPanelState = {
  loadingText: '',
  loadingProgress: { percent: 0, displayText: '' },
  isLoadingDone: false,
  isPredictionDone: false,
}

const useEndPanelStore = create<EndPanelStore>((set) => ({
  ...defaultState,

  setLoadingText: (loadingText: string) => set({ loadingText }),
  setLoadingProgress: (loadingProgress: Progress) => set({ loadingProgress }),
  setIsLoadingDone: (isLoadingDone: boolean) => set({ isLoadingDone }),
  setIsPredictionDone: (isPredictionDone: boolean) => set({ isPredictionDone }),
  
  resetStates: () => set({
    ...defaultState,
  }),
}));

export default useEndPanelStore;