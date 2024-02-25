import { QueryKey } from "@renderer/globals/enums";
import { getFileNameFromPath } from "@renderer/globals/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import VideoCardRenamer from "./VideoCardRenamer";
import VideoCardPopover from "./VideoCardPopover";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface VideoCardProps {
  video: VideoData,
}

const VideoCard: React.FC<VideoCardProps> = ({ video } : VideoCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(() => window.electronAPI.deleteVideo(video.id), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
      toast(`Cleared collected data from ${video.path}.`, {
        type: 'success'
      })
    }
  })
  const updateMutation = useMutation(() => window.electronAPI.updateVideo(video.id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QueryKey.Videos);
      if (data) {
        toast(`Updated video path to ${data}.`, {
          type: 'success'
        })
      }
    }
  })

  const { isLoading, isError, data: isFileExisting } = useQuery<boolean>([QueryKey.IsFileExisting, video.path], () => window.electronAPI.isFileExisting(video.path))
  
  // const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="relative">
      <div 
        title={video.path}
        className='group/video-card cursor-pointer flex flex-col transition-all rounded-lg shadow-around hover:shadow-around-dark'
        onClick={() => navigate(`${video.id}`)}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-48 bg-black rounded-t-lg overflow-hidden">
          {isHovered ? (
            <video
              className="w-full h-full object-scale-down aspect-video opacity-50"
              muted
              autoPlay
            >
              <source 
                type="video/mp4"
                src={`http://localhost:3000/video?source=app&id=${video.id}`}
              />
            </video>
          ) : (
            <img 
              className="w-full h-full opacity-90 object-cover aspect-video" 
              src={`filehandler://thumbnail//${video.id}`}
            />
          )}
        </div>

        <div className="absolute top-2 right-2">
          <VideoCardPopover video={video} />
        </div>

        <div className="flex flex-col items-start justify-start">
          {/* {isRenaming ? (
            <VideoCardRenamer video={video} setIsRenaming={setIsRenaming}/>
          ) : (
          )} */}
          <div className="flex flex-row items-center justify-between w-full bg-white px-4 py-1 rounded-b-lg">
            <div className="flex flex-col items-start">
              <p className='font-medium text-left w-full line-clamp-1 text-color-primary/75 group-hover/video-card:text-color-primary transition-colors'>{getFileNameFromPath(video.path, true)}</p>
              <p className="text-sm text-gray-400/75 group-hover/video-card:text-gray-400 transition-colors">{video.timestamp}</p>
            </div>

            {/* <Link 
              to={`${video.id}`}
              className={`text-color-primary hover:text-color-primary-inactive text-sm ${isHovered ? 'opacity-100' : 'opacity-[15%]'} transition-colors`}
            >
              View
            </Link> */}
            {/* <VideoCardPopover video={video} /> */}
          </div>
        </div>
      </div>

      {!isLoading && !isError && !isFileExisting ? (
        <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-75 flex flex-col justify-center gap-4 px-8 py-2">
          <p className="break-words text-gray-200 text-sm">Video file "<span className="font-bold line-clamp-3">{video.path}</span>" does not exist.</p>          
          <div className="flex flex-col gap-2 justify-center px-4">
            <button 
              type="button" 
              className="bg-white hover:bg-gray-200 py-2 text-xs basis-full"
              onClick={() => updateMutation.mutate()}
            >Update Location</button>
            <button 
              type="button" 
              className="bg-white hover:bg-gray-200 py-2 text-xs basis-full"
              onClick={() => deleteMutation.mutate()}
            >Clear</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default VideoCard;