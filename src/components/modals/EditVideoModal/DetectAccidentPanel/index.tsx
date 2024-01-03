import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import FramePagination from './FramePagination';
import DetectAccidentModelHandler from './DetectAccidentModelHandler';
import FrameDescription from './FrameDescription';

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
  // selectedTabIndex,
  // setAreTabsDisabled,
  // videoPath,
  // startTime,
  // endTime
}) => {
  const [loadingText, setLoadingText] = useState<string>("");
  const [trimOutputPath, setTrimOutputPath] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<Progress>({ percent: 0, displayText: "0%"});
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);
  const [frameCount, setFrameCount] = useState(0);

  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [iouThreshold, setIouThreshold] = useState(50);

  const [selectedFrame, setSelectedFrame] = useState(0);

  // const detectAccidentsMutation = useMutation(
  //   async () => await window.electronAPI.runAccidentDetectionModel(),
  //   {
  //     onMutate: () => {
  //       setLoadingProgress({ percent: 0, displayText: "Frame 0/0" });
  //       setLoadingText("Detecting accidents...")
  //     },
  //     onSuccess: (data) => {
  //       console.log(`data is at ${data}`)
        
  //       setTimeout(() => {
  //         setAreTabsDisabled(false);
  //         window.electronAPI.removeRunAccidentDetectionModelProgressListener();
  //         setIsLoadingDone(true);
  //       }, 500)
  //     },
  //   }
  // )

  // const extractFramesMutation = useMutation(
  //   async () => await window.electronAPI.extractFrames(),
  //   {
  //     onMutate: () => {
  //       setLoadingProgress({ percent: 0, displayText: "0%" });
  //       setLoadingText("Extracting frames...")
  //     },
  //     onSuccess: (data) => {
  //       setFrameCount(data);
  //       setLoadingProgress({ percent: 100, displayText: "100%" });

  //       setTimeout(() => {
  //         window.electronAPI.removeExtractFramesProgressListener();
  //         // detectAccidentsMutation.mutate();

  //         // TODO: Remove this later once detectAccidentsMutation is uncommented
  //         setAreTabsDisabled(false);
  //         setIsLoadingDone(true);
  //       }, 500)
  //     }
  //   }
  // )

  // const trimMutation = useMutation(
  //   async () => await window.electronAPI.trimVideo(videoPath, startTime, endTime),
  //   {
  //     onMutate: () => {
  //       setLoadingProgress({ percent: 0, displayText: "0%" });
  //       setLoadingText("Trimming video...")
  //     },
  //     onSuccess: (data) => {
  //       setLoadingProgress({ percent: 100, displayText: "100%" });
  //       setTrimOutputPath(data);

  //       setTimeout(() => {
  //         window.electronAPI.removeTrimProgressListener();
  //         extractFramesMutation.mutate();
  //       }, 300);
  //     }
  //   }
  // );

  // useEffect(() => {
  //   console.log(`DetectAccidentPanel: selectedTabIndex: ${selectedTabIndex}`)
  //   if (selectedTabIndex === 1) {
  //     setIsLoadingDone(false);
  //     setAreTabsDisabled(true);
  //     trimMutation.mutate();
      
  //     window.electronAPI.onTrimProgress((progress: Progress) => {
  //       if (progress) {
  //         setLoadingProgress(progress)
  //       }
  //     })

  //     window.electronAPI.onExtractFramesProgress((progress: Progress) => {
  //       if (progress) {
  //         setLoadingProgress(progress)
  //       }
  //     })

  //     window.electronAPI.onRunAccidentDetectionModelProgress((progress: Progress) => {
  //       console.log(`RECEIVING DATA IN REACT: ${JSON.stringify(progress)}`)
  //       if (progress) {
  //         setLoadingProgress(progress)
  //       }
  //     })
  //   }

  //   return () => {
  //     if (selectedTabIndex === 1) {
  //       window.electronAPI.killPythonProcess();
  //     }
  //     window.electronAPI.removeTrimProgressListener();
  //     window.electronAPI.removeExtractFramesProgressListener();
  //     window.electronAPI.removeRunAccidentDetectionModelProgressListener();
  //     console.log("DetectAccidentPanel progress listeners removed");
  //   }
  // }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-gray-50 flex flex-col overflow-y-auto">
      <div className='w-full flex flex-col justify-start items-center p-4'>
        <div className='flex flex-col w-full h-full gap-4'>
          <div className='flex flex-row gap-4'>
            <div className='bg-black flex justify-center items-center w-full'>
              <img
                src={`fileHandler://tempFrame//${selectedFrame + 1}`}
                className='object-contain'
              />
            </div>

            <div className='flex flex-col gap-4'>
              <FrameDescription detections={[]} selectedFrame={selectedFrame} />
              <DetectAccidentModelHandler 
                confidenceThreshold={confidenceThreshold}
                setConfidenceThreshold={setConfidenceThreshold}
                iouThreshold={iouThreshold}
                setIouThreshold={setIouThreshold}
              />
            </div>          
          </div>

          <FramePagination 
            // frameCount={frameCount} 
            frameCount={24}
            selectedFrame={selectedFrame}
            setSelectedFrame={setSelectedFrame}
          />
        </div>
      </div>
      {/* {isLoadingDone ? (
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
          <div className='w-full flex flex-row justify-between gap-1'>
            <p className='font-medium'>{loadingText}</p>
            <p className='font-medium text-gray-400'>{loadingProgress.displayText}</p>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full">
            <div className="bg-color-primary rounded-full h-2 transition-width duration-300" style={{ width: `${loadingProgress.percent}%` }}></div>
          </div>
        </div>    
      )} */}
    </Tab.Panel>
  );
};

export default DetectAccidentPanel;
