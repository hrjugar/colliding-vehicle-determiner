import { Tab } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import useEditVideoModalStore from '../store';
import { useShallow } from 'zustand/react/shallow';
import useIdentifyVehiclesPanelStore from './store';
import DetectedObjects from './DetectedObjects';

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
      state.resetModelStates
    ])
  )
  
  const videoRef = useRef<HTMLVideoElement>(null);

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
        setIsAccidentDetectionModelChanged(false);
        setIsLoadingDone(true);
      }
    }
  )
  
  useEffect(() => {
    console.log("IN IdentifyVehiclesPanel");
    console.log(`isAccidentDetectionModelChanged: ${isAccidentDetectionModelChanged}`);
    if (selectedTabIndex === 2 && isAccidentDetectionModelChanged) {
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
    <Tab.Panel className="w-full h-full bg-white p-4 flex flex-row justify-start items-start gap-4">
      {isLoadingDone ? (
        <>
          <DetectedObjects />

          <div className='w-full flex flex-col'>
            <div className='bg-black w-full flex justify-center items-center'>
              <video
                ref={videoRef}
                className="max-w-full max-h-full flex object-scale-down aspect-video"
                muted
              >
                <source 
                  src={`http://localhost:3000/video?source=app&temp=true`} 
                  type="video/mp4" 
                />
              </video>
            </div>

            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-10 h-10 text-color-primary cursor-pointer"
              onClick={() => {}}
            >
              <path 
                d={true ? (
                  "M21.3333 13.7067V51.04L50.6667 32.3733L21.3333 13.7067Z"
                ): (
                  "M37.3333 50.6667H48V13.3334H37.3333M16 50.6667H26.6667V13.3334H16V50.6667Z"
                )}
                className="fill-current"
              />
            </svg>
            <p>Aye Test</p>
          </div>
        </>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center gap-2 px-8'>
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
