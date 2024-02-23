import { Dialog } from "@headlessui/react";
import { getFileNameFromPath } from "../globals/utils";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../globals/enums";
import { useRef, useState } from "react";

interface RenameVideoModalProps {
  video: VideoData,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RenameVideoModal: React.FC<RenameVideoModalProps> = ({ 
  video, 
  isOpen, 
  setIsOpen
}) => {
  const queryClient = useQueryClient();
  const renameMutation = useMutation((newFileName: string) => window.electronAPI.renameVideo(video.id, video.path, newFileName), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
    }
  })

  const [newFileName, setNewFileName] = useState<string>(getFileNameFromPath(video.path, true)!);
    
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

      <div className='fixed inset-0 w-screen flex flex-col items-center justify-center p-4'>
        <Dialog.Panel
          className={'rounded-sm shadow-lg'}
        >
          <div className='flex flex-row justify-start items-center gap-4 bg-color-primary p-4'>
            <Dialog.Title className='text-lg text-white'>Rename video</Dialog.Title>
          </div>

          <div className='bg-white p-4 flex flex-col gap-4'>
            <input 
              className="border-[1.5px] border-gray-200 w-full rounded-lg px-4 py-2"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />

            <div className='flex flex-row justify-end gap-2 text-sm'>
              <button 
                className='px-4 py-2 bg-white hover:bg-gray-100 border-[1px] border-black rounded-sm'
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className='px-4 py-2 bg-color-primary text-white hover:bg-color-primary-inactive rounded-sm'
                onClick={() => {
                  renameMutation.mutate(newFileName);
                  setIsOpen(false)
                }}
              >
                Rename
              </button>          
            </div>            
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
};

export default RenameVideoModal;