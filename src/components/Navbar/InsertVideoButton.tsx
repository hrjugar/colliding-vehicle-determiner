
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
      className="group/add-button w-10 h-10 rounded-lg bg-blue-400 hover:bg-blue-500 hover:cursor-pointer flex justify-center items-center"
      onClick={() => {
        mutation.mutate()
      }}
    >
      <span className="group-hover/add-button:text-gray-100 text-white text-2xl font-light text-center">+</span>
    </button>
  );
};

export default InsertVideoButton;
