import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query"
import { ModalContext } from "../../contexts/ModalContext";
import { useModal } from "../../globals/hooks";
import { ModalType } from "../../globals/enums";
import { getFileNameFromPath } from "../../globals/utils";

interface VideoCardProps {
  video: Video,
}

const VideoCard: React.FC<VideoCardProps> = ({ video } : VideoCardProps) => {

  const { openModal } = useModal();

  const thumbnailPath = `thumbnail://${video.id}`
  return (
    <div 
      title={video.path}
      className='group/video-card flex flex-col items-start p-2 hover:bg-gray-200 hover:cursor-pointer w-64'
    >
      <div className="relative">
        <img className="w-full h-40" src={thumbnailPath} />
        <button
          type="button"
          className="hidden group/video-card-delete-btn group-hover/video-card:flex absolute right-2 top-2 flex-col justify-center items-center p-2 border-none rounded-sm bg-red-500 hover:bg-red-600"
          // onClick={() => deleteMutation.mutate(video.id)}
          onClick={() => openModal(ModalType.DeleteVideo, { video })}
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white w-4 h-4 group-hover/video-card-delete-btn:text-gray-100"
          >
            <path 
              d="M18.6667 56C17.2 56 15.9449 55.4782 14.9014 54.4347C13.8578 53.3911 13.3351 52.1351 13.3334 50.6667V16H10.6667V10.6667H24V8H40V10.6667H53.3334V16H50.6667V50.6667C50.6667 52.1333 50.1449 53.3893 49.1014 54.4347C48.0578 55.48 46.8018 56.0018 45.3334 56H18.6667ZM45.3334 16H18.6667V50.6667H45.3334V16ZM24 45.3333H29.3334V21.3333H24V45.3333ZM34.6667 45.3333H40V21.3333H34.6667V45.3333Z"
              className="fill-current"
            />
          </svg>          
          
        </button>
      </div>
      {/* <div className='w-full h-40 bg-gray-200 group-hover/video-card:bg-gray-100'></div> */}
      <p className='group-hover/video-card:font-semibold'>{getFileNameFromPath(video.path, true)}</p>
      <p className='group-hover/video-card:underline text-gray-400 text-sm text-left w-full line-clamp-1'>{video.path}</p>
    </div>    
  )
}

export default VideoCard;