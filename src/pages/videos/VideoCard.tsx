import { useModal, useOutsideAlerter } from "../../globals/hooks";
import { ModalType, QueryKey } from "../../globals/enums";
import { getFileNameFromPath } from "../../globals/utils";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface VideoCardProps {
  video: Video,
}

const VideoCard: React.FC<VideoCardProps> = ({ video } : VideoCardProps) => {
  const queryClient = useQueryClient();
  const renameMutation = useMutation((newFileName: string) => window.electronAPI.renameVideo(video.id, video.path, newFileName), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
    }
  })
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
  const { openModal } = useModal();
  const renameInputRef = useRef<HTMLInputElement>(null);
  const renameVideoGroupRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(renameVideoGroupRef, () => {
    setIsRenaming(false);
  })

  console.log(`thumbnail: thumbnail://${video.id}`)
  return (
    <div className="relative">
      <div 
        title={video.path}
        className='group/video-card flex flex-col items-start p-2 hover:bg-gray-200 hover:cursor-pointer w-64'
      >
        <div className="relative">
          <img className="w-full h-40 bg-gray-400 opacity-75 group-hover/video-card:opacity-100" src={`thumbnail://${video.id}`}/>
          <div className="hidden group-hover/video-card:flex absolute right-2 top-2 flex-row gap-2">
            <button 
              type="button"
              className="group/video-card-rename-btn rounded-sm bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-black border-[1px] border-gray-300 p-2"
              onClick={() => setIsRenaming(true)}
              title="Rename Video"
            >
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-800 group-hover/video-card-rename-btn:text-black"
              >
                <path 
                  d="M40 42.6667L29.3333 53.3333H56V42.6667H40ZM32.16 19.1733L8 43.3333V53.3333H18L42.16 29.1733L32.16 19.1733ZM15.7867 48H13.3333V45.5467L32.16 26.6667L34.6667 29.1733L15.7867 48ZM49.8933 21.44C50.9333 20.4 50.9333 18.6667 49.8933 17.68L43.6533 11.44C43.1534 10.944 42.4776 10.6656 41.7733 10.6656C41.0691 10.6656 40.3933 10.944 39.8933 11.44L35.0133 16.32L45.0133 26.32L49.8933 21.44Z"
                  className="fill-current"
                />
              </svg>
            </button>
            {/* TODO: Replace 'Open Folder' text with svg icon */}
            <button 
              type="button"
              className="group/video-card-folder-btn rounded-sm bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-black border-[1px] border-gray-300 p-2"
              onClick={() => window.electronAPI.openVideoFolder(video.path)}
              title="Open Video Folder"
            >
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-800 group-hover/video-card-folder-btn:text-black"
              >
                <path 
                  d="M53.3333 48H10.6667V21.3333H53.3333M53.3333 16H32L26.6667 10.6666H10.6667C7.70668 10.6666 5.33334 13.04 5.33334 16V48C5.33334 49.4144 5.89525 50.771 6.89544 51.7712C7.89563 52.7714 9.25219 53.3333 10.6667 53.3333H53.3333C54.7478 53.3333 56.1044 52.7714 57.1046 51.7712C58.1048 50.771 58.6667 49.4144 58.6667 48V21.3333C58.6667 19.9188 58.1048 18.5623 57.1046 17.5621C56.1044 16.5619 54.7478 16 53.3333 16Z"
                  className="fill-current"
                />
              </svg>
            </button>
            <button
              type="button"
              className="group/video-card-delete-btn flex flex-col justify-center items-center p-2 border-none rounded-sm bg-red-500 hover:bg-red-600"
              // onClick={() => deleteMutation.mutate(video.id)}
              onClick={() => openModal(ModalType.DeleteVideo, { video })}
              title="Delete"
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
        </div>
        {/* <div className='w-full h-40 bg-gray-200 group-hover/video-card:bg-gray-100'></div> */}
        {isRenaming ? (
          <div className="flex flex-row w-full mt-2 border-[1px] border-gray-300" ref={renameVideoGroupRef}>
            <input 
              type="text" 
              className=" bg-white text-black w-full px-2 py-1 text-sm" 
              defaultValue={getFileNameFromPath(video.path, true)}
              ref={renameInputRef}
            />
            <button 
              type="button" 
              className="px-2 py-1 text-xs text-white border-r-[1px] border-gray-300 bg-red-500 hover:bg-red-600"
              onClick={() => setIsRenaming(false)}
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
              onClick={() => {
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
        ) : (
          <>
            <p className='group-hover/video-card:font-semibold text-left w-full line-clamp-1'>{getFileNameFromPath(video.path, true)}</p>
            <p className='group-hover/video-card:underline text-gray-400 text-sm text-left w-full line-clamp-1'>{video.path}</p>
          </>
        )}
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