import { useShallow } from "zustand/react/shallow";
import useEditVideoModalStore from "../store";
import { useEffect, useState } from "react";
import useEndPanelStore from "./store";
import LoadingProgress from "@/components/LoadingProgress";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EndPanel: React.FC = () => {
  const [
    videoPath,
    selectedTabIndex,
    closeModal,
    setTabsDisabledState,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoPath,
      state.selectedTabIndex,
      state.closeModal,
      state.setTabsDisabledState,
    ])
  )

  const [
    loadingText,
    setLoadingText,
    loadingProgress,
    setLoadingProgress,
    setIsLoadingDone,
    resetStates,
  ] = useEndPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,
      state.setIsLoadingDone,
      state.resetStates,
    ])
  )

  const navigate = useNavigate();

  const insertVideoMutation = useMutation(
    async () => await window.electronAPI.insertVideo(videoPath),
    {
      onMutate: () => {
        setTabsDisabledState(true);
        setLoadingText('Inserting video into database...');
        setLoadingProgress({ displayText: '0%', percent: 0 });
      },
      onSuccess: (id) => {
        setLoadingProgress({ displayText: '100%', percent: 100 })

        setTimeout(() => {
          setIsLoadingDone(true);
          closeModal();
          navigate(`/videos/${id}`);
        }, 300);
      },
      onError: (err) => {
        setIsLoadingDone(true);
        closeModal();

        if (err instanceof Error) {
          toast.error(err.message);
        } else if (typeof err === 'string') {
          toast.error(err);
        } else {
          toast.error('Something went wrong.');
        }
      }
    }
  )

  useEffect(() => {
    if (selectedTabIndex === 3) {
      resetStates();
      insertVideoMutation.mutate();
    }
  }, [selectedTabIndex]);
  
  return (
    <div className="w-full h-full flex justify-center items-center px-4">
      <LoadingProgress 
        loadingText={loadingText}
        loadingProgress={loadingProgress}
      />
    </div>
  );
};

export default EndPanel;
