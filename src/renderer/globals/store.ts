import { create } from "zustand";

interface GlobalStoreState {
  isWindowButtonGroupColorLight: boolean;
}

interface GlobalStoreAction {
  setIsWindowButtonGroupColorLight: (isLight: boolean) => void;
}

type GlobalStore = GlobalStoreState & GlobalStoreAction;

const useGlobalStore = create<GlobalStore>((set) => ({
  isWindowButtonGroupColorLight: true,
  setIsWindowButtonGroupColorLight: (isLight) => set({ isWindowButtonGroupColorLight: isLight })
}));

export default useGlobalStore;