import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "@renderer/globals/enums";
import { getFileNameFromPath } from "@renderer/globals/utils";
import { toast } from "react-toastify";
import { useOutsideAlerter } from "@renderer/globals/hooks";

interface VideoCardRenamerProps {
  video: VideoData;
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoCardRenamer: React.FC<VideoCardRenamerProps> = ({ video, setIsRenaming }) => {
  const queryClient = useQueryClient();
  const renameMutation = useMutation((newFileName: string) => window.electronAPI.renameVideo(video.id, video.path, newFileName), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
    }
  })

  const renameVideoGroupRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useOutsideAlerter(renameVideoGroupRef, () => {
    setIsRenaming(false);
  })

  return (
    <div className="flex flex-row w-full border-[1px] border-gray-300" ref={renameVideoGroupRef}>
      <input 
        type="text" 
        className=" bg-white text-black w-full px-1 py-1" 
        defaultValue={getFileNameFromPath(video.path, true)}
        ref={renameInputRef}
        onClick={(e) => e.stopPropagation()}
      />
      <button 
        type="button" 
        className="px-2 py-1 text-xs text-white border-r-[1px] border-gray-300 bg-red-500 hover:bg-red-600"
        onClick={(e) => { 
          e.stopPropagation(); 
          setIsRenaming(false);
        }}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white w-4 h-4"
        >
          <path 
            d="M35.8933 32L50.6666 46.7734V50.6667H46.7733L32 35.8934L17.2266 50.6667H13.3333V46.7734L28.1066 32L13.3333 17.2267V13.3334H17.2266L32 28.1067L46.7733 13.3334H50.6666V17.2267L35.8933 32Z" 
            className="fill-current"
          />
        </svg>
      </button>
      <button 
        type="button" 
        className="px-2 py-1 bg-blue-500 text-xs text-white hover:bg-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          renameMutation.mutate(renameInputRef.current?.value as string);
          setIsRenaming(false);
          toast(`Renamed ${getFileNameFromPath(video.path, true)} to ${renameInputRef.current?.value as string}`, {
            type: 'success',
          })
        }}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white w-4 h-4"
        >
          <path 
            d="M56 18.6666L24 50.6666L9.33334 35.9999L13.0933 32.24L24 43.12L52.24 14.9066L56 18.6666Z" 
            className="fill-current"
          />
        </svg>
      </button>
    </div>    
  )
}

export default VideoCardRenamer;