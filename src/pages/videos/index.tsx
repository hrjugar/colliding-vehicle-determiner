import { useQuery } from "react-query";
import VideoCard from "./VideoCard";
import { useRef } from "react";
import { QueryKey } from "../../globals/enums";

const VideosPage: React.FC = () => {
  const { isLoading, isError, data: videos, error } = useQuery<Video[]>(QueryKey.Videos, window.electronAPI.selectAllVideos);

  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className='page gap-4'>
      <div className="flex flex-row justify-between items-center gap-1">
        <h1 className='text-2xl font-semibold px-4'>Traffic Accident Videos</h1>
        <button 
          type="button"
          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
        </button>
      </div>

      {isLoading ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>Error: {(error as any).message}</p>
        </div>        
      ) : videos?.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>No videos found.</p>
        </div>
      ) : (
        <div className='flex flex-row flex-wrap gap-4 overflow-y-auto px-4'>
          {videos?.map((video) => {
            return (
              <VideoCard key={video.id} video={video} />
            )
          })}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
