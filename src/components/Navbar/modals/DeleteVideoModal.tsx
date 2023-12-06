import { getFileNameFromPath } from '../../../globals/utils';
import { useModal } from '../../../globals/hooks';
import { useQueryClient, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { QueryKey } from '../../../globals/enums';

interface DeleteVideoModalProps {
  video: Video
}

const DeleteVideoModal: React.FC<DeleteVideoModalProps> = ({ video }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(window.electronAPI.deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.Videos);
      toast(`Deleted collected data from ${video.path}.`, {
        type: 'success'
      })
    }
  })

  const { closeModal } = useModal();
  // Add your component logic here

  return (
    // Add your JSX code for the component here
    <div className='fixed bg-white w-96 flex flex-col items-stretch rounded-sm gap-2 p-4'>
      <img src={`thumbnail://${video.id}`} className='border-gray-600 border-[1px]' />
      <div className='flex flex-col items-start mb-8 text-left gap-1'>
        <p className='text-gray-800 text-lg font-bold leading-tight'>Delete video data</p>
        <p className='text-gray-500 text-sm'>Are you sure you want to delete the collected data from <span className='font-bold'>{getFileNameFromPath(video.path)}</span>? The video itself will not be deleted, and only the data made by the program will be erased.</p>
      </div>
      
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
