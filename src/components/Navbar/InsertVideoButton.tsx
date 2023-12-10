
import React, { useState, useReducer } from 'react';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from 'react-toastify';
import EditVideoModal from '../modals/EditVideoModal';

interface EditVideoModalState {
  isOpen: boolean;
  videoPath: string;
}

type EditVideoModalAction = 
  { 
    type: 'OPEN',
    payload: string
  } |
  { 
    type: 'CLOSE',
  };

const reducer = (state: EditVideoModalState, action: EditVideoModalAction): EditVideoModalState => {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true, videoPath: action.payload };
    case 'CLOSE':
      return { ...state, isOpen: false, videoPath: '' };
    default:
      return state;
  }
};

const InsertVideoButton: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { 
    isOpen: false, 
    videoPath: '' 
  });

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
  

  const mutation = useMutation(window.electronAPI.findNewVideo, {
    onSuccess: (data) => {
      if (data) {
        dispatch({ type: 'OPEN', payload: data });
        // openModal(ModalType.EditVideo, { videoPath: data });
      }
    }
  })

  return (
    <>
      <div className='px-2 py-4'>
        <button 
          type="button" 
          title="Add Video"
          className="p-2 bg-white rounded-full flex flex-col justify-center items-center drop-shadow-xl"
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
      </div>

      <EditVideoModal 
        videoPath={state.videoPath}
        isOpen={state.isOpen}
        close={() => dispatch({ type: 'CLOSE' })}
      />
    </>
  );
};

export default InsertVideoButton;
