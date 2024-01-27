import { create } from "zustand";
import { VideoPageTab } from "./types";

interface PageState {
  selectedTabIndex: VideoPageTab;
}

interface PageAction {
  setSelectedTabIndex: (selectedTabIndex: VideoPageTab) => void;
  resetStates: () => void;
}

type VideoPageState = PageState;
type VideoPageAction = PageAction;
type VideoPageStore = VideoPageState & VideoPageAction;

const defaultState: VideoPageState = {
  selectedTabIndex: 0
};

const useVideoPageStore = create<VideoPageStore>((set) => ({
  ...defaultState,

  setSelectedTabIndex: (selectedTabIndex: VideoPageTab) => set(() => ({ selectedTabIndex })),
  resetStates: () => set(() => ({ ...defaultState }))
}));

export default useVideoPageStore;