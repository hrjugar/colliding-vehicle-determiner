import { create } from "zustand";

interface ObjectState {
  selectedObjectIndex: number,
  shouldShowOnlyVehicles: boolean,
}

interface ObjectAction {
  setSelectedObjectIndex: (selectedObjectIndex: number) => void,
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => void,
}

type IdentifyVehiclesPanelState = ObjectState;
type IdentifyVehiclesPanelAction = ObjectAction;
type IdentifyVehiclesPanelStore = IdentifyVehiclesPanelState & IdentifyVehiclesPanelAction;

const defaultState: IdentifyVehiclesPanelState = {
  selectedObjectIndex: 0,
  shouldShowOnlyVehicles: true,
}

const useIdentifyVehiclesPanelStore = create<IdentifyVehiclesPanelStore>((set) => ({
  ...defaultState,

  setSelectedObjectIndex: (selectedObjectIndex: number) => set(() => ({ selectedObjectIndex })),
  setShouldShowOnlyVehicles: (shouldShowOnlyVehicles: boolean) => set(() => ({ shouldShowOnlyVehicles })),
}));

export default useIdentifyVehiclesPanelStore;