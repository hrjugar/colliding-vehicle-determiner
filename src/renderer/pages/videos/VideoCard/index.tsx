import { QueryKey } from "@renderer/globals/enums";
import { getFileNameFromPath } from "@renderer/globals/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import VideoCardRenamer from "./VideoCardRenamer";
import VideoCardPopover from "./VideoCardPopover";
import { useNavigate } from "react-router-dom";

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
  
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="relative w-[calc(50%_-_16px)] lg:w-[calc(33%_-_16px)] xl:w-[calc(25%_-_16px)] 2xl:w-[400px]">
      <div 
        title={video.path}
        className='group/video-card flex flex-col cursor-pointer transition-all'
        onClick={() => navigate(`${video.id}`)}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-48 bg-black rounded-lg overflow-hidden">
          {isHovered ? (
            <video
              className="w-full h-full object-scale-down aspect-video"
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

        <div className="flex flex-col items-start justify-start">
          {isRenaming ? (
            <VideoCardRenamer video={video} setIsRenaming={setIsRenaming}/>
          ) : (
            <div className="flex flex-row items-center justify-between w-full">
              <p className='font-medium group-hover/video-card:font-semibold text-left w-full line-clamp-1 py-1 px-1 my-[1px]'>{getFileNameFromPath(video.path, true)}</p>
              <VideoCardPopover video={video} setIsRenaming={setIsRenaming}/>
            </div>
          )}
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