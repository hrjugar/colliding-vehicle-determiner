import { getFileNameFromPath } from "@/renderer/globals/utils";
import { create } from "zustand";

interface VideosPageState {
  videos: VideoData[],
  filteredVideos: VideoData[]
}

interface VideosPageAction {
  initVideos: (videos: VideoData[]) => void;
  filterVideos: (filterText: string) => void;
  resetStates: () => void;
}

type VideosPageStore = VideosPageState & VideosPageAction;

const defaultState: VideosPageState = {
  videos: [],
  filteredVideos: [],
};

const useVideosPageStore = create<VideosPageStore>((set, get) => ({
  ...defaultState,

  initVideos: (videos: VideoData[]) => set({ videos, filteredVideos: videos }),
  filterVideos: (filterText: string) => {
    if (filterText === "") {
      set({ filteredVideos: get().videos });
      return;
    }

    const newFilteredVideos = get().videos.filter((video) => getFileNameFromPath(video.path, true)?.includes(filterText));
    console.log(newFilteredVideos);
    set({ filteredVideos: newFilteredVideos });
  },
  resetStates: () => set({ ...defaultState })
}));

export default useVideosPageStore;