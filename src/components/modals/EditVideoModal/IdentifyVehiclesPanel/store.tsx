import { create } from "zustand";

interface CompletionState {
  loadingText: string;
  loadingProgress: Progress;
  isLoadingDone: boolean;
}

interface CompletionAction {
  setLoadingText: (loadingText: string) => void;
  setLoadingProgress: (progress: Progress) => void;
  setIsLoadingDone: (isLoadingDone: boolean) => void;
}

interface ObjectState {
  deepSORTOutput: DeepSORTOutput,
  selectedObjectId: number,
  shouldShowOnlyVehicles: boolean,
  selectedFrame: number,
}

interface ObjectAction {
  getSelectedObject: () => DeepSORTObject | null,
  setDeepSORTOutput: (deepSORTOutput: DeepSORTOutput) => void,
  setSelectedObjectId: (selectedObjectIndex: number) => void,
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => void,
  setSelectedFrame: (selectedFrame: number) => void,
}

interface VideoState {
  duration: number;
  isPaused: boolean;
  timePercentage: number;
}

interface VideoAction {
  setDuration: (duration: number) => void,
  playVideo: () => void,
  pauseVideo: () => void,
  setTimePercentage: (timeMarker: number) => void,
}

interface PanelAction {
  resetModelStates: () => void,
}

type IdentifyVehiclesPanelState = CompletionState & ObjectState & VideoState;
type IdentifyVehiclesPanelAction = CompletionAction & ObjectAction & VideoAction & PanelAction;
type IdentifyVehiclesPanelStore = IdentifyVehiclesPanelState & IdentifyVehiclesPanelAction;

const defaultState: IdentifyVehiclesPanelState = {
  loadingText: "",
  loadingProgress: {
    percent: 0,
    displayText: "",
  },
  isLoadingDone: false,
  deepSORTOutput: [],
  selectedObjectId: 0,
  shouldShowOnlyVehicles: true,
  selectedFrame: -1,
  duration: 0,
  isPaused: true,
  timePercentage: 0,
}

const useIdentifyVehiclesPanelStore = create<IdentifyVehiclesPanelStore>((set, get) => ({
  ...defaultState,

  setLoadingText: (loadingText: string) => set({ loadingText }),
  setLoadingProgress: (loadingProgress: Progress) => set({ loadingProgress }),
  setIsLoadingDone: (isLoadingDone: boolean) => set({ isLoadingDone }),

  getSelectedObject: () => {
    if (get().selectedObjectId === 0) return null;
    return get().deepSORTOutput.find((obj) => obj.id === get().selectedObjectId) ?? null;
  },
  setDeepSORTOutput: (deepSORTOutput: DeepSORTOutput) => set(() => ({ deepSORTOutput })),
  setSelectedObjectId: (selectedObjectId: number) => set(() => ({ selectedObjectId, selectedFrame: -1 })),
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => set(() => ({ shouldShowOnlyVehicles })),
  setSelectedFrame: (selectedFrame: number) => set(() => ({ selectedFrame })),

  setDuration: (duration: number) => set(() => ({ duration })),
  playVideo: () => set(() => ({ isPaused: false })),
  pauseVideo: () => set(() => ({ isPaused: true })),
  setTimePercentage: (timeMarker: number) => set(() => ({ timePercentage: timeMarker })),
  
  resetModelStates: () => set(() => defaultState),
}));

export default useIdentifyVehiclesPanelStore;