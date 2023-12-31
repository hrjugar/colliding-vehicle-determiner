import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

interface Progress {
  percent: number,
  displayText: string
}

interface DetectAccidentPanelProps {
  setAreTabsDisabled: (disabled: boolean) => void,
  selectedTabIndex: number,
  videoPath: string,
  startTime: number,
  endTime: number
}

const DetectAccidentPanel: React.FC<DetectAccidentPanelProps> = ({ 
  selectedTabIndex,
  setAreTabsDisabled,
  videoPath,
  startTime,
  endTime
}) => {
  const [loadingText, setLoadingText] = useState<string>("");
  const [trimOutputPath, setTrimOutputPath] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<Progress>({ percent: 0, displayText: "0%"});
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);
  const [modelPredictions, setModelPredictions] = useState<any[]>([]);

  // TODO: Cancel accident detection when tab is changed or modal is closed

  const detectAccidentsMutation = useMutation(
    async () => await window.electronAPI.runAccidentDetectionModel(),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Frame 0/0" });
        setLoadingText("Detecting accidents...")
      },
      onSuccess: (data) => {
        console.log(`data is at ${data}`)
        setAreTabsDisabled(false);

        setTimeout(() => {
          window.electronAPI.removeRunAccidentDetectionModelProgressListener();
          setIsLoadingDone(true);
        }, 500)
      },
    }
  )

  const extractFramesMutation = useMutation(
    async () => await window.electronAPI.extractFrames(),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "0%" });
        setLoadingText("Extracting frames...")
      },
      onSuccess: (_) => {
        setLoadingProgress({ percent: 100, displayText: "100%" });

        setTimeout(() => {
          window.electronAPI.removeExtractFramesProgressListener();
          detectAccidentsMutation.mutate();
        }, 500)
      }
    }
  )

  const trimMutation = useMutation(
    async () => await window.electronAPI.trimVideo(videoPath, startTime, endTime),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "0%" });
        setLoadingText("Trimming video...")
      },
      onSuccess: (data) => {
        setLoadingProgress({ percent: 100, displayText: "100%" });
        setTrimOutputPath(data);

        setTimeout(() => {
          window.electronAPI.removeTrimProgressListener();
          extractFramesMutation.mutate();
        }, 300);
      }
    }
  );

  useEffect(() => {
    console.log(`DetectAccidentPanel: selectedTabIndex: ${selectedTabIndex}`)
    if (selectedTabIndex === 1) {
      setIsLoadingDone(false);
      setAreTabsDisabled(true);
      trimMutation.mutate();
      
      window.electronAPI.onTrimProgress((progress: Progress) => {
        if (progress) {
          setLoadingProgress(progress)
        }
      })

      window.electronAPI.onExtractFramesProgress((progress: Progress) => {
        if (progress) {
          setLoadingProgress(progress)
        }
      })

      window.electronAPI.onRunAccidentDetectionModelProgress((progress: Progress) => {
        console.log(`RECEIVING DATA IN REACT: ${JSON.stringify(progress)}`)
        if (progress) {
          setLoadingProgress(progress)
        }
      })
    }

    return () => {
      window.electronAPI.removeTrimProgressListener();
      window.electronAPI.removeExtractFramesProgressListener();
      window.electronAPI.removeRunAccidentDetectionModelProgressListener();
      console.log("DetectAccidentPanel progress listeners removed");
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-center items-center">
      {isLoadingDone ? (
        <p>Loading is done</p>
        // <div className='w-full h-full flex flex-col items-center gap-4 pb-2'>
        //   <div className='relative w-full h-full flex justify-center overflow-hidden bg-black'>
        //     <video
        //       className="max-w-full max-h-full flex object-scale-down aspect-video"
        //       muted
        //       controls
        //     >
        //       <source
        //         src={`http://localhost:${import.meta.env.VITE_EXPRESS_PORT}/video?path=${trimOutputPath}&tabIndex=${selectedTabIndex}&t=${Date.now()}`}
        //         type="video/mp4" 
        //       />
        //     </video>
        //   </div>

        //   <button 
        //     type='button'
        //     className='bg-color-primary text-white rounded-lg'
        //   >
        //     Identify vehicles
        //   </button>
        // </div>
      ) : (
        <div className='w-full flex flex-col justify-center items-center gap-2'>
          <div className='w-full flex flex-row justify-between gap-1'>
            <p className='font-medium'>{loadingText}</p>
            <p className='font-medium'>{loadingProgress.displayText}</p>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full">
            <div className="bg-color-primary rounded-full h-2 transition-width duration-300" style={{ width: `${loadingProgress.percent}%` }}></div>
          </div>
        </div>    
      )}
    </Tab.Panel>
  );
};

export default DetectAccidentPanel;
