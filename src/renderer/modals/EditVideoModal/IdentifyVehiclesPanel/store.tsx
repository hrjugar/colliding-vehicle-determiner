import { create } from "zustand";

const vehicleClassifications = ['car', 'truck', 'bus', 'motorcycle'];

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
  selectedYOLOModel: YOLOModel,
  deepSORTOutput: DeepSORTOutput,
  selectedObjectId: number,
  selectedFrame: number,
  shownClassifications: Set<string>;
}

interface ObjectAction {
  getSelectedObject: () => DeepSORTObject | null,
  getAllClassifications: () => Set<string>,
  getShownObjects: () => DeepSORTOutput,
  setSelectedYOLOModel: (yoloModel: YOLOModel) => void,
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
  resetModelStates: (excludeModel?: boolean) => void,
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
  selectedYOLOModel: "yolov8l.pt",
  deepSORTOutput: [],
  selectedObjectId: 0,
  selectedFrame: -1,
  shownClassifications: new Set<string>(vehicleClassifications),
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
  getAllClassifications: () => {
    const classifications = new Set<string>();
    get().deepSORTOutput.forEach((obj) => classifications.add(obj.classification));
    return classifications;
  },
  getShownObjects: () => {
    const shownClassifications = get().shownClassifications;
    return get().deepSORTOutput.filter((obj) => shownClassifications.has(obj.classification));
  },
  setSelectedYOLOModel: (yoloModel: YOLOModel) => set(() => ({ selectedYOLOModel: yoloModel })),
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
  
  resetModelStates: (excludeModel = false) => set({ ...defaultState, ...(excludeModel ? {
    selectedYOLOModel: get().selectedYOLOModel,
  } : {})}),
}));

export default useIdentifyVehiclesPanelStore;