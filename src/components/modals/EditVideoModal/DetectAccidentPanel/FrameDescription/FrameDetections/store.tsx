import { create } from "zustand";

interface FrameDetectionsState {
  descriptionToggles: boolean[]
}

interface FrameDetectionsAction {
  initializeDescriptionToggles: (framePredictionCount: number) => void;
  toggleBoxDescription: (boxIndex: number) => void;
}

type FrameDetectionsStore = FrameDetectionsState & FrameDetectionsAction;

const useFrameDetectionsStore = create<FrameDetectionsStore>((set) => ({
  descriptionToggles: [],

  initializeDescriptionToggles: (framePredictionCount: number) => set({
    descriptionToggles: Array(framePredictionCount).fill(true)
  }),
  toggleBoxDescription: (boxIndex: number) => set((state) => {
    const newDescriptionToggles = [...state.descriptionToggles];
    newDescriptionToggles[boxIndex] = !state.descriptionToggles[boxIndex];
    
    return {
      descriptionToggles: newDescriptionToggles
    };
  })
}))

export default useFrameDetectionsStore;