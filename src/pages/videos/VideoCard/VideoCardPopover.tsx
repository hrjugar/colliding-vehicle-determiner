import { Popover } from "@headlessui/react"
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DeleteVideoModal from "../../../components/modals/DeleteVideoModal";

interface VideoCardPopoverProps {
  video: Video,
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoCardPopover: React.FC<VideoCardPopoverProps> = ({ video, setIsRenaming }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  
  return (
    <div className="relative">
      <Popover className='relative flex flex-col justify-center items-center'>
        <Popover.Button 
          className='rounded-full hover:bg-gray-100 transition-colors p-1' 
          title="Menu"
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-color-primary w-6 h-6"
          >
            <path 
              d="M32 42.6666C33.4145 42.6666 34.771 43.2285 35.7712 44.2287C36.7714 45.2289 37.3333 46.5855 37.3333 48C37.3333 49.4144 36.7714 50.771 35.7712 51.7712C34.771 52.7714 33.4145 53.3333 32 53.3333C30.5855 53.3333 29.229 52.7714 28.2288 51.7712C27.2286 50.771 26.6667 49.4144 26.6667 48C26.6667 46.5855 27.2286 45.2289 28.2288 44.2287C29.229 43.2285 30.5855 42.6666 32 42.6666ZM32 26.6666C33.4145 26.6666 34.771 27.2285 35.7712 28.2287C36.7714 29.2289 37.3333 30.5855 37.3333 32C37.3333 33.4144 36.7714 34.771 35.7712 35.7712C34.771 36.7714 33.4145 37.3333 32 37.3333C30.5855 37.3333 29.229 36.7714 28.2288 35.7712C27.2286 34.771 26.6667 33.4144 26.6667 32C26.6667 30.5855 27.2286 29.2289 28.2288 28.2287C29.229 27.2285 30.5855 26.6666 32 26.6666ZM32 10.6666C33.4145 10.6666 34.771 11.2285 35.7712 12.2287C36.7714 13.2289 37.3333 14.5855 37.3333 16C37.3333 17.4144 36.7714 18.771 35.7712 19.7712C34.771 20.7714 33.4145 21.3333 32 21.3333C30.5855 21.3333 29.229 20.7714 28.2288 19.7712C27.2286 18.771 26.6667 17.4144 26.6667 16C26.6667 14.5855 27.2286 13.2289 28.2288 12.2287C29.229 11.2285 30.5855 10.6666 32 10.6666Z"
              className="fill-current"
            />
          </svg>
        </Popover.Button>

        <Popover.Panel 
          className="absolute top-full right-0 z-10 pb-4" 
        >
          {({ close }) => {
            return (
              <div className="flex flex-col items-stretch whitespace-nowrap bg-white border-[1px] border-gray-200 shadow-lg">
                <button 
                  type="button"
                  className="group/video-card-rename-btn rounded-sm hover:bg-color-primary px-4 py-2 flex flex-row items-center gap-4 text-sm border-b-[1px] border-gray-200"
                  onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}
                  title="Rename Video"
                >
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-800 group-hover/video-card-rename-btn:text-white"
                  >
                    <path 
                      d="M40 42.6667L29.3333 53.3333H56V42.6667H40ZM32.16 19.1733L8 43.3333V53.3333H18L42.16 29.1733L32.16 19.1733ZM15.7867 48H13.3333V45.5467L32.16 26.6667L34.6667 29.1733L15.7867 48ZM49.8933 21.44C50.9333 20.4 50.9333 18.6667 49.8933 17.68L43.6533 11.44C43.1534 10.944 42.4776 10.6656 41.7733 10.6656C41.0691 10.6656 40.3933 10.944 39.8933 11.44L35.0133 16.32L45.0133 26.32L49.8933 21.44Z"
                      className="fill-current"
                    />
                  </svg>
                  <span className="group-hover/video-card-rename-btn:text-white text-color-primary">Rename Video</span>
                </button>        

                <button 
                  type="button"
                  className="group/video-card-folder-btn rounded-sm hover:bg-color-primary px-4 py-2 flex flex-row items-center gap-4 text-sm border-b-[1px] border-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.electronAPI.openVideoFolder(video.path)
                    close();
                  }}
                  title="Open Video Folder"
                >
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-800 group-hover/video-card-folder-btn:text-white"
                  >
                    <path 
                      d="M53.3333 48H10.6667V21.3333H53.3333M53.3333 16H32L26.6667 10.6666H10.6667C7.70668 10.6666 5.33334 13.04 5.33334 16V48C5.33334 49.4144 5.89525 50.771 6.89544 51.7712C7.89563 52.7714 9.25219 53.3333 10.6667 53.3333H53.3333C54.7478 53.3333 56.1044 52.7714 57.1046 51.7712C58.1048 50.771 58.6667 49.4144 58.6667 48V21.3333C58.6667 19.9188 58.1048 18.5623 57.1046 17.5621C56.1044 16.5619 54.7478 16 53.3333 16Z"
                      className="fill-current"
                    />
                  </svg>
                  <span className="group-hover/video-card-folder-btn:text-white text-color-primary">Open Video Folder</span>
                </button>

                <button
                  type="button"
                  className="group/video-card-delete-btn rounded-sm hover:bg-red-600 px-4 py-2 flex flex-row items-center gap-4 text-sm border-b-[1px] border-gray-200"
                  // onClick={() => deleteMutation.mutate(video.id)}
                  // onClick={() => openModal(ModalType.DeleteVideo, { video })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModalIsOpen(true)
                    close()
                  }}
                  title="Delete"
                >
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-color-primary w-4 h-4 group-hover/video-card-delete-btn:text-gray-100"
                  >
                    <path 
                      d="M18.6667 56C17.2 56 15.9449 55.4782 14.9014 54.4347C13.8578 53.3911 13.3351 52.1351 13.3334 50.6667V16H10.6667V10.6667H24V8H40V10.6667H53.3334V16H50.6667V50.6667C50.6667 52.1333 50.1449 53.3893 49.1014 54.4347C48.0578 55.48 46.8018 56.0018 45.3334 56H18.6667ZM45.3334 16H18.6667V50.6667H45.3334V16ZM24 45.3333H29.3334V21.3333H24V45.3333ZM34.6667 45.3333H40V21.3333H34.6667V45.3333Z"
                      className="fill-current"
                    />
                  </svg>          

                  <span className="group-hover/video-card-delete-btn:text-white">Delete</span>
                </button>             
              </div>
            )
          }}
        </Popover.Panel>
        {/* {createPortal(
          document.getElementById('popover-root')!
        )} */}
      </Popover>

      <DeleteVideoModal 
        video={video} 
        isOpen={deleteModalIsOpen}
        setIsOpen={setDeleteModalIsOpen}
      />
    </div>
  )
}

export default VideoCardPopover;