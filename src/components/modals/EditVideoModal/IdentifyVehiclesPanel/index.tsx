import { Tab } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import useEditVideoModalStore from '../store';
import { useShallow } from 'zustand/react/shallow';
import useIdentifyVehiclesPanelStore from './store';
import DetectedObjects from './DetectedObjects';
import VideoPlayer from './VideoPlayer';
import SelectedObjectFramePagination from './SelectedObjectFramePagination';
import SelectedObjectFrame from './SelectedObjectFrame';

interface IdentifyVehiclesPanelProps {
  selectedTabIndex: number,
}

const IdentifyVehiclesPanel: React.FC<IdentifyVehiclesPanelProps> = ({ selectedTabIndex }) => {
  const [
    isAccidentDetectionModelChanged,
    setIsAccidentDetectionModelChanged
  ] = useEditVideoModalStore( 
    useShallow((state) => [
      state.isAccidentDetectionModelChanged,
      state.setIsAccidentDetectionModelChanged
    ])
  )

  const [
    loadingText,
    setLoadingText,
    loadingProgress,
    setLoadingProgress,
    isLoadingDone,
    setIsLoadingDone,
    setDeepSORTOutput,
    isPaused,
    playVideo,
    pauseVideo,
    resetModelStates,
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.setDeepSORTOutput,
      state.isPaused,
      state.playVideo,
      state.pauseVideo,
      state.resetModelStates
    ])
  )

  const copyVideoMutation = useMutation(
    async () => await window.electronAPI.copyDeepSORTVideo(),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Getting video with labelled vehicles...");
      },
      onSuccess: (_) => {
        console.log("Finished copying video.");
        setIsAccidentDetectionModelChanged(false);
        setIsLoadingDone(true);
      }
    }
  )

  const deepSORTMutation = useMutation(
    async () => await window.electronAPI.runDeepSORTModel(),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Identifying vehicles...");
      },
      onSuccess: (data) => {
        console.log(`Python DeepSORT script exit code: ${data}`)
        setDeepSORTOutput(data as DeepSORTOutput);
        copyVideoMutation.mutate();
      }
    }
  )
  
  useEffect(() => {
    console.log("IN IdentifyVehiclesPanel");
    console.log(`isAccidentDetectionModelChanged: ${isAccidentDetectionModelChanged}`);
    // TODO: change this later
    // if (selectedTabIndex === 2 && isAccidentDetectionModelChanged) {
    if (selectedTabIndex === 0) {
      resetModelStates();
      deepSORTMutation.mutate();

      window.electronAPI.onRunDeepSORTModelProgress((progress: Progress) => {
        setLoadingProgress(progress);
      })
    }

    return () => {
      window.electronAPI.removeRunDeepSORTModelProgressListener();
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-start items-start overflow-y-auto gap-4 p-4">
      {isLoadingDone ? (
        <>
          <div className='w-full flex flex-row gap-4'>
            <DetectedObjects />
            <VideoPlayer />
          </div>

          <div className='w-full flex-grow flex flex-row gap-4'>
            <SelectedObjectFramePagination />
            <SelectedObjectFrame />
          </div>
        </>
        // <div className='w-full self-stretch flex flex-col justify-start gap-4 p-4'>
        // </div>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center gap-2 px-4'>
          <div className='w-full flex flex-row justify-between gap-1'>
            <p className='font-medium'>{loadingText}</p>
            <p className='font-medium text-gray-400'>{loadingProgress.displayText}</p>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full">
            <div className="bg-color-primary rounded-full h-2 transition-width duration-300" style={{ width: `${loadingProgress.percent}%` }}></div>
          </div>
        </div>    
      )}
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
