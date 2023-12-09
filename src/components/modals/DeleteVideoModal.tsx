import { getFileNameFromPath } from '../../globals/utils';
import { useQueryClient, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { QueryKey } from '../../globals/enums';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

interface DeleteVideoModalProps {
  video: Video,
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({ video, isOpen, setIsOpen }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(window.electronAPI.deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
      toast(`Deleted collected data from ${video.path}.`, {
        type: 'success'
      })
    }
  })

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
          <div className='flex flex-row justify-start items-center gap-4 bg-red-500 p-4'>
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg"
              className='w-8 h-8 text-white'
            >
              <path 
                d="M34.6667 37.3334H29.3333V24H34.6667M34.6667 48H29.3333V42.6667H34.6667M2.66666 56H61.3333L32 5.33337L2.66666 56Z"
                className='fill-current'
              />
            </svg>
            <Dialog.Title className='text-lg text-white'>Delete video data</Dialog.Title>
          </div>

          <div className='bg-white p-4 flex flex-col gap-8'>
            <div>
              <Dialog.Description>Are you sure you want to delete the collected data from <span className='font-bold'>{getFileNameFromPath(video.path)}</span>?</Dialog.Description>
              <p>The video itself will not be deleted, and only the data made by the program will be erased.</p>
            </div>

            <div className='flex flex-row justify-end gap-2'>
              <button 
                className='px-4 py-2 bg-white hover:bg-gray-100 border-[1px] border-black rounded-sm'
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-sm'
                onClick={() => {
                  deleteMutation.mutate(video.id)
                  setIsOpen(false)
                }}
              >
                Delete
              </button>          
          </div>
               
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteVideoModal;
