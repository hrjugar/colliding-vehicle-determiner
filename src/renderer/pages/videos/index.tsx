import { useQuery } from "react-query";
import VideoCard from "./VideoCard";
import { QueryKey } from "@renderer/globals/enums";
import { useEffect, useState } from "react";
import useVideosPageStore from "./store";
import { useShallow } from "zustand/react/shallow";
import InsertVideoButton from "./InsertVideoButton";
import useGlobalStore from "@/renderer/globals/store";

const VideosPage: React.FC = () => {
  const { isLoading, isError, data: videos, error } = useQuery<VideoData[]>(QueryKey.Videos, window.electronAPI.selectAllVideos);
  const [currentSearchText, setCurrentSearchText] = useState<string>("");

  const [
    filteredVideos,
    initVideos,
    filterVideos,
    resetStates,
  ] = useVideosPageStore(
    useShallow((state) => [
      state.filteredVideos,
      state.initVideos,
      state.filterVideos,
      state.resetStates,
    ])
  )

  const [setIsWindowButtonGroupColorLight] = useGlobalStore((state) => [state.setIsWindowButtonGroupColorLight]);

  useEffect(() => {
    resetStates();
    setIsWindowButtonGroupColorLight(true);
  }, []);

  useEffect(() => {
    if (videos) {
      initVideos(videos);
    }
  }, [videos]);

  useEffect(() => {
    filterVideos(currentSearchText);
  }, [currentSearchText]);

  return (
    <div className='page bg-slate-100'>
      <div className="w-full flex flex-row items-stretch px-6 py-4 pointer-events-none bg-gradient-to-b from-color-primary to-[#040619]">
        <div className="flex-1 flex flex-row justify-start items-center draggable">
          <h1 className="text-left text-xl font-medium text-slate-100">Library</h1>
        </div>
        
        <div className="flex-grow flex flex-col justify-center items-stretch pointer-events-auto no-drag">
          <div className={`h-full rounded-full flex flex-row items-center px-6 gap-2 ${videos && videos.length > 0 ? 'bg-white/25' : 'pointer-events-none bg-gray-100 opacity-50'}`}>        
            <input 
              type="text" 
              className="bg-transparent w-full text-center py-2 placeholder-white/25 text-white/75"
              onChange={(e) => setCurrentSearchText(e.target.value)}
              value={currentSearchText}
              placeholder="Search..."
            />
            {currentSearchText ? (
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="w-3 h-3 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setCurrentSearchText("")}
              >
                <path 
                  d="M0 0 L64 64 M64 0 L0 64 Z"
                  className="fill-current stroke-[8] stroke-white/75"
                />
              </svg>
            ) : null}
          </div>
        </div>

        <div className="flex-1 pointer-events-none">
          <div className="w-[calc(100%_-_116px)] h-full draggable pt-4"/>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-row flex-wrap content-start gap-4 pl-4 pb-4 w-full h-full overflow-y-auto">
          {Array.from({ length: 16 }).map((_, index) => (
            <div 
              key={`loading-video-card-${index}`}
              className="flex flex-col gap-2 relative w-[calc(50%_-_16px)] lg:w-[calc(33%_-_16px)] xl:w-[calc(25%_-_16px)] 2xl:w-[400px] animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg" />
              <div className="w-1/2 h-4 bg-gray-200 rounded-md"/>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>Error: {(error as Error).message}</p>
        </div>        
      ) : filteredVideos?.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>No videos found.</p>
        </div>
      ) : (
        <div className='w-full grid grid-cols-[repeat(auto-fill,_minmax(340px,_1fr))] justify-items-stretch gap-8 p-8 overflow-y-auto'>
          {filteredVideos?.map((video) => {
            return (
              <VideoCard key={video.id} video={video} />
            )
          })}
        </div>
      )}
      
      <InsertVideoButton />
    </div>
  );
};

export default VideosPage;
