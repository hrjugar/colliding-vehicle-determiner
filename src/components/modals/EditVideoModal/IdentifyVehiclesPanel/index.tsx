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
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSkip = (isBackwards : boolean) => {
    if (videoRef.current) {
      videoRef.current.currentTime = isBackwards ? 0 : videoRef.current.duration;
    }
  }
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        playVideo();
      } else {
        videoRef.current.pause();
        pauseVideo();
      }
    }
  }

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
    <Tab.Panel className="w-full h-full bg-white p-4 flex flex-row justify-start items-start gap-4 overflow-y-auto">
      {isLoadingDone ? (
        <>
          <DetectedObjects />

          <div className='group w-full h-full flex flex-col'>
            <div className='relative bg-black w-full h-full flex justify-center items-center'>
              <video
                ref={videoRef}
                className="max-w-full max-h-full flex object-contain"
                muted
                onEnded={pauseVideo}
              >
                <source 
                  src={`http://localhost:3000/video?source=app&temp=true`} 
                  type="video/mp4" 
                />
              </video>

              <div className={`opacity-0 group-hover:opacity-100 absolute flex justify-center items-center gap-8 text-white transition-opacity`}>
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-12 h-12 bg-black/50 rounded-full p-2 cursor-pointer"
                  onClick={() => handleVideoSkip(true)}
                >
                  <path 
                    d="M16 48V16H21.3333V48H16ZM25.3333 32L48 16V48L25.3333 32Z"
                    className="fill-current"
                  />
                </svg>

                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-24 h-24 bg-black/50 rounded-full p-4 cursor-pointer"
                  onClick={() => handlePlayPause()}
                >
                  <path 
                    d={isPaused ? (
                      "M21.3333 13.7067V51.04L50.6667 32.3733L21.3333 13.7067Z"
                    ): (
                      "M37.3333 50.6667H48V13.3334H37.3333M16 50.6667H26.6667V13.3334H16V50.6667Z"
                    )}
                    className="fill-current"
                  />
                </svg>

                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-12 h-12 bg-black/50 rounded-full p-2 cursor-pointer"
                  onClick={() => handleVideoSkip(false)}
                >
                  <path 
                    d="M42.6667 48H48V16H42.6667M16 48L38.6667 32L16 16V48Z"
                    className="fill-current"
                  />
                </svg>
              </div>             
            </div>
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
