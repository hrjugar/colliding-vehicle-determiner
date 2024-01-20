import { useShallow } from "zustand/react/shallow";
import useEditVideoModalStore from "../store";
import { useEffect, useState } from "react";
import useEndPanelStore from "./store";
import LoadingProgress from "@/components/LoadingProgress";

const EndPanel: React.FC = () => {
  const [
    selectedTabIndex,
    closeModal,
    setTabsDisabledState,
  ] = useEditVideoModalStore(
    useShallow((state) => [
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
    isLoadingDone,
    setIsLoadingDone,
    resetStates,
  ] = useEndPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.resetStates,
    ])
  )

  useEffect(() => {
    if (selectedTabIndex === 3) {
      setTabsDisabledState(true);
      resetStates();
    }
  }, [selectedTabIndex]);
  
  return (
    // Add your JSX code here
    <div className="w-full h-full flex justify-center items-center px-4">
      <LoadingProgress 
        loadingText={loadingText}
        loadingProgress={loadingProgress}
      />
    </div>
  );
};

export default EndPanel;
