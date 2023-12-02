import React from 'react';
import { getFileNameFromPath } from '../../../globals/utils';
import { useModal } from '../../../globals/hooks';
import { useQueryClient, useMutation } from 'react-query';

interface DeleteVideoModalProps {
  video: Video
}

const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({ video }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(window.electronAPI.deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries('videos');
    }
  })

  const { closeModal } = useModal();
  // Add your component logic here

  return (
    // Add your JSX code for the component here
    <div className='fixed bg-white w-96 flex flex-col items-stretch rounded-sm gap-2 p-4'>
      <img src={`thumbnail://${video.id}`} className='border-gray-600 border-[1px]' />
      <p className='text-left text-gray-600 font-semibold mb-4'>Are you sure you want to delete the analysis data for <span>{getFileNameFromPath(video.path)}</span>?</p>
      
      <div className='flex flex-row gap-4 self-end'>
        <button 
          className='flex-grow px-4 py-2 border-[1px] border-black text-black hover:bg-gray-100'
          onClick={() => closeModal()}
        >
          Cancel
        </button>
        <button 
          className='flex-grow px-4 py-2 bg-red-500 text-white hover:bg-red-600'
          onClick={() => {
            deleteMutation.mutate(video.id)
            closeModal()
          }}
        >Delete</button>
      </div>
    </div>
  );
};

export default DeleteVideoModal;
