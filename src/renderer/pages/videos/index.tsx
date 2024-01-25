import { useQuery } from "react-query";
import VideoCard from "./VideoCard";
import { QueryKey } from "@renderer/globals/enums";
import PageHeader from "@renderer/components/PageHeader";

const VideosPage: React.FC = () => {
  const { isLoading, isError, data: videos, error } = useQuery<VideoData[]>(QueryKey.Videos, window.electronAPI.selectAllVideos);

  return (
    <div className='page'>
      <PageHeader 
        title="Videos" 
        breadcrumbs={[
          <p>Home</p>
        ]}
      />
      
      {isLoading ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>Error: {(error as Error).message}</p>
        </div>        
      ) : videos?.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p>No videos found.</p>
        </div>
      ) : (
        <div className='flex flex-row flex-wrap content-start gap-4 pr-6 w-full h-full overflow-y-auto'>
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
