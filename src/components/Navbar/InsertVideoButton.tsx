
import React from 'react';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from 'react-toastify';
import { ModalType, QueryKey } from '../../globals/enums';
import { useModal } from '../../globals/hooks';

const InsertVideoButton: React.FC = () => {
  // const queryClient = useQueryClient();
  // const mutation = useMutation(window.electronAPI.insertVideo, {
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries(QueryKey.Videos);
  //     if (data) {
  //       toast('Successfully added video.', {
  //         type: 'success'
  //       })
  //     }
  //   }
  // })
  const { openModal } = useModal();
  const mutation = useMutation(window.electronAPI.findNewVideo, {
    onSuccess: (data) => {
      if (data) {
        openModal(ModalType.EditVideo, { videoPath: data });
      }
    }
  })

  return (
    <button 
      type="button" 
      title="Add Video"
      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-color-primary-active cursor-pointer flex justify-center items-center p-2 drop-shadow-xl"
      onClick={() => {
        mutation.mutate()
      }}
    >
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 64 64" 
        xmlns="http://www.w3.org/2000/svg"
        className='text-color-primary w-4 h-4'
      >
        <path 
          d="M50.6667 34.6667H34.6667V50.6667H29.3333V34.6667H13.3333V29.3334H29.3333V13.3334H34.6667V29.3334H50.6667V34.6667Z"
          className='fill-current'
        />
      </svg>    
    </button>
  );
};

export default InsertVideoButton;
