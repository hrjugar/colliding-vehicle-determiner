import { QueryKey } from "@/globals/enums";
import { getFileNameFromPath } from "@/globals/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import VideoCardRenamer from "./VideoCardRenamer";
import VideoCardPopover from "./VideoCardPopover";

interface VideoCardProps {
  video: Video,
}

const VideoCard: React.FC<VideoCardProps> = ({ video } : VideoCardProps) => {
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
  
  const [ isRenaming, setIsRenaming ] = useState<boolean>(false);

  console.log(`thumbnail: thumbnail://${video.id}`)
  return (
    <div className="relative">
      <div 
        title={video.path}
        className='group/video-card flex flex-col items-stretch p-2 mb-4 cursor-pointer bg-white rounded-sm  border-[2px] border-gray-300 hover:border-color-primary transition-all shadow-md hover:shadow-lg w-80 gap-1'
      >
        <img className="w-full h-48 bg-gray-400 opacity-90 group-hover/video-card:opacity-100 object-cover" src={`thumbnail://${video.id}`}/>
        <div className="flex flex-col items-start justify-start ">
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