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
  selectedObjectIndex: number,
  shouldShowOnlyVehicles: boolean,
}

interface ObjectAction {
  setSelectedObjectIndex: (selectedObjectIndex: number) => void,
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => void,
}

interface PanelAction {
  resetModelStates: () => void,
}

type IdentifyVehiclesPanelState = CompletionState & ObjectState;
type IdentifyVehiclesPanelAction = CompletionAction & ObjectAction & PanelAction;
type IdentifyVehiclesPanelStore = IdentifyVehiclesPanelState & IdentifyVehiclesPanelAction;

const defaultState: IdentifyVehiclesPanelState = {
  loadingText: "",
  loadingProgress: {
    percent: 0,
    displayText: "",
  },
  isLoadingDone: false,
  selectedObjectIndex: 0,
  shouldShowOnlyVehicles: true,
}

const useIdentifyVehiclesPanelStore = create<IdentifyVehiclesPanelStore>((set) => ({
  ...defaultState,

  setLoadingText: (loadingText: string) => set({ loadingText }),
  setLoadingProgress: (loadingProgress: Progress) => set({ loadingProgress }),
  setIsLoadingDone: (isLoadingDone: boolean) => set({ isLoadingDone }),

  setSelectedObjectIndex: (selectedObjectIndex: number) => set(() => ({ selectedObjectIndex })),
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => set(() => ({ shouldShowOnlyVehicles })),

  resetModelStates: () => set(() => defaultState),
}));

export default useIdentifyVehiclesPanelStore;