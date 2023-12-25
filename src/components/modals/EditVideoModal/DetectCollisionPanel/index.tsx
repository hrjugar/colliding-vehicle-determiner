import { Dialog, Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

interface DetectCollisionPanelProps {
  setAreTabsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  selectedTabIndex: number,
  videoPath: string,
  startTime: number,
  endTime: number
}

const DetectCollisionPanel: React.FC<DetectCollisionPanelProps> = ({ 
  selectedTabIndex,
  setAreTabsDisabled,
  videoPath,
  startTime,
  endTime
}) => {
  const [loadingText, setLoadingText] = useState<string>("");
  const [trimOutputPath, setTrimOutputPath] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);

  const extractFramesMutation = useMutation(
    async () => await window.electronAPI.extractFrames(),
    {
      onSuccess: (_) => {
        setLoadingProgress(100);
        setAreTabsDisabled(false);

        setTimeout(() => {
          setIsLoadingDone(true);
        }, 500)
      }
    }
  )

  const trimMutation = useMutation(
    async () => await window.electronAPI.trimVideo(videoPath, startTime, endTime),
    {
      onSuccess: (data) => {
        setLoadingProgress(100);
        setTrimOutputPath(data);

        setTimeout(() => {
          setLoadingProgress(0);
          setLoadingText("Extracting Frames...")
          window.electronAPI.removeTrimProgressListener();
          extractFramesMutation.mutate();
        }, 300);
      }
    }
  );

  useEffect(() => {
    console.log(`DetectCollisionPanel: selectedTabIndex: ${selectedTabIndex}`)
    if (selectedTabIndex === 1) {
      setIsLoadingDone(false);
      setLoadingProgress(0);
      setLoadingText("Trimming Video...")
      setAreTabsDisabled(true);
      trimMutation.mutate();
      
      window.electronAPI.onTrimProgress((progressPercent: number) => {
        if (progressPercent) {
          setLoadingProgress(progressPercent)
        }
      })

      window.electronAPI.onExtractFramesProgress((progressPercent: number) => {
        if (progressPercent) {
          setLoadingProgress(progressPercent)
        }
      })
    }

    return () => {
      console.log("Trim progress listener removed");
      window.electronAPI.removeTrimProgressListener();
      window.electronAPI.removeExtractFramesProgressListener();
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-center items-center">
      {isLoadingDone ? (
        <div className='w-full h-full flex flex-col items-center gap-4 pb-2'>
          <div className='relative w-full h-full flex justify-center overflow-hidden bg-black'>
            <video
              className="max-w-full max-h-full flex object-scale-down aspect-video"
              muted
              controls
            >
              <source
                src={`http://localhost:3000/video?path=${trimOutputPath}&tabIndex=${selectedTabIndex}&t=${Date.now()}`}
                type="video/mp4" 
              />
            </video>
          </div>

          <button 
            type='button'
            className='bg-color-primary text-white rounded-lg'
          >
            Identify vehicles
          </button>
        </div>
      ) : (
        <div className='w-full flex flex-col justify-center items-center gap-2'>
          <div className='w-full flex flex-row justify-between gap-1'>
            <p className='font-medium'>{loadingText}</p>
            <p className='font-medium'>{loadingProgress}%</p>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full">
            <div className="bg-color-primary rounded-full h-2 transition-width duration-300" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>    
      )}
    </Tab.Panel>
  );
};

export default DetectCollisionPanel;
