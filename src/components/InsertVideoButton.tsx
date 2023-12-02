
import React from 'react';
import { useMutation, useQueryClient } from "react-query";

const InsertVideoButton: React.FC = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(window.electronAPI.insertVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries('videos');
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
