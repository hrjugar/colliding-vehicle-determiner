import { useQuery } from "react-query";
import VideoCard from "./VideoCard";
import { QueryKey } from "@renderer/globals/enums";
import { useEffect, useState } from "react";
import useVideosPageStore from "./store";
import { useShallow } from "zustand/react/shallow";
import InsertVideoButton from "./InsertVideoButton";

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

  useEffect(() => {
    resetStates();
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
      <div className="w-full flex flex-row items-stretch pb-6 px-6 pointer-events-none bg-gradient-to-b from-color-primary to-[#040619]">
        <h1 className="flex-1 text-left text-2xl font-semibold draggable pt-4 text-white">Library</h1>
        
        <div className="flex-grow flex flex-col justify-center items-stretch pointer-events-auto no-drag pt-4">
          <div className={`h-full border-[1px] rounded-full flex flex-row items-center pl-3 pr-4 gap-2 ${videos && videos.length > 0 ? 'bg-white' : 'pointer-events-none bg-gray-100 opacity-50'}`}>
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg"
              className='w-4 h-4 text-color-primary/75'
            >
              <path 
                d="M25.3333 8C29.9304 8 34.3392 9.82618 37.5899 13.0768C40.8405 16.3274 42.6667 20.7362 42.6667 25.3333C42.6667 29.6267 41.0933 33.5733 38.5067 36.6133L39.2267 37.3333H41.3333L54.6667 50.6667L50.6667 54.6667L37.3333 41.3333V39.2267L36.6133 38.5067C33.4681 41.1914 29.4686 42.6664 25.3333 42.6667C20.7362 42.6667 16.3274 40.8405 13.0768 37.5899C9.82618 34.3392 8 29.9304 8 25.3333C8 20.7362 9.82618 16.3274 13.0768 13.0768C16.3274 9.82618 20.7362 8 25.3333 8ZM25.3333 13.3333C18.6667 13.3333 13.3333 18.6667 13.3333 25.3333C13.3333 32 18.6667 37.3333 25.3333 37.3333C32 37.3333 37.3333 32 37.3333 25.3333C37.3333 18.6667 32 13.3333 25.3333 13.3333Z"
                className='fill-current'
              />
            </svg>            
            <input 
              type="text" 
              className="bg-transparent w-full text-left text-sm"
              onChange={(e) => setCurrentSearchText(e.target.value)}
              value={currentSearchText}
              placeholder="Search..."
            />
            {currentSearchText ? (
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="w-2.5 h-2.5 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setCurrentSearchText("")}
              >
                <path 
                  d="M0 0 L64 64 M64 0 L0 64 Z"
                  className="fill-current stroke-[6] stroke-color-primary group-hover/titlebar-close-btn:stroke-white"
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
        <div className='flex flex-row flex-wrap content-start gap-4 pl-4 py-4 w-full h-full overflow-y-auto'>
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
