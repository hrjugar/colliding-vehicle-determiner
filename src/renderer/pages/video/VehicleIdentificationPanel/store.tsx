import { create } from "zustand";
import { vehicleClassifications } from "./constants";

interface CompletionState {
  isLoadingDone: boolean;
}

interface CompletionAction {
  setIsLoadingDone: (isLoadingDone: boolean) => void;
}

interface ObjectState {
  deepSORTOutput: DeepSORTOutput;
  selectedObjectId: number,
  selectedFrame: number,
  shownClassifications: Set<string>;
}

interface ObjectAction {
  getSelectedObject: () => DeepSORTObject | null,
  getAllClassifications: () => Set<string>,
  getShownObjects: () => DeepSORTOutput,
  setDeepSORTOutput: (deepSORTOutput: DeepSORTOutput) => void,
  setSelectedObjectId: (selectedObjectIndex: number) => void,
  setSelectedFrame: (selectedFrame: number) => void,
  setClassificationVisibility: (classification: string, isVisible: boolean) => void,
  hideAllClassifications: () => void,
  showAllClassifications: () => void,
  showOnlyVehicleClassification: () => void,
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
  resetStates: () => void;
}

type VehicleIdentificationPanelState = CompletionState & ObjectState & VideoState;
type VehicleIdentificationPanelAction = CompletionAction & ObjectAction & PanelAction & VideoAction;
type VehicleIdentificationPanelStore = VehicleIdentificationPanelState & VehicleIdentificationPanelAction;

const defaultState: VehicleIdentificationPanelState = {
  isLoadingDone: false,
  deepSORTOutput: [],
  selectedObjectId: 0,
  selectedFrame: -1,
  shownClassifications: new Set<string>(vehicleClassifications),
  duration: 0,
  isPaused: true,
  timePercentage: 0,
};

const useVehicleIdentificationPanelStore = create<VehicleIdentificationPanelStore>((set, get) => ({
  ...defaultState,

  setIsLoadingDone: (isLoadingDone: boolean) => set(() => ({ isLoadingDone })),

  getSelectedObject: () => {
    if (get().selectedObjectId === 0) return null;
    return get().deepSORTOutput.find((obj) => obj.id === get().selectedObjectId) ?? null;
  },
  getAllClassifications: () => {
    const classifications = new Set<string>();
    get().deepSORTOutput.forEach((obj) => classifications.add(obj.classification));
    return classifications;
  },
  getShownObjects: () => {
    const shownClassifications = get().shownClassifications;
    return get().deepSORTOutput.filter((obj) => shownClassifications.has(obj.classification));
  },
  setDeepSORTOutput: (deepSORTOutput: DeepSORTOutput) => set(() => ({ deepSORTOutput })),
  setSelectedObjectId: (selectedObjectId: number) => set(() => ({ selectedObjectId, selectedFrame: -1 })),
  setSelectedFrame: (selectedFrame: number) => set(() => ({ selectedFrame })),
  setClassificationVisibility: (classification: string, isVisible: boolean) => {
    const newShownClassifications = new Set(get().shownClassifications);
    if (isVisible) {
      newShownClassifications.add(classification);
    } else {
      newShownClassifications.delete(classification);
    }

    set({ shownClassifications: newShownClassifications })
  },
  hideAllClassifications: () => set(() => ({ shownClassifications: new Set<string>() })),
  showAllClassifications: () => set(() => ({ shownClassifications: new Set<string>(get().getAllClassifications()) })),
  showOnlyVehicleClassification: () => set(() => {
    return ({ shownClassifications: new Set<string>(vehicleClassifications) });
  }),

  setDuration: (duration: number) => set(() => ({ duration })),
  playVideo: () => set(() => ({ isPaused: false })),
  pauseVideo: () => set(() => ({ isPaused: true })),
  setTimePercentage: (timeMarker: number) => set(() => ({ timePercentage: timeMarker })),

  resetStates: () => set(defaultState),
}));

export default useVehicleIdentificationPanelStore;