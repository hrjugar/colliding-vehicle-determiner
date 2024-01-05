import { Tab } from '@headlessui/react';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import FramePagination from './FramePagination';
import DetectAccidentModelHandler from './DetectAccidentModelHandler';
import FrameDescription from './FrameDescription';
import SelectFrameImage from './SelectedFrameImage';
import useEditVideoModalStore from '@/store/useEditVideoModalStore';

export interface PredictionBox {
  x: number,
  y: number,
  w: number,
  h: number,
  xn: number,
  yn: number,
  wn: number,
  hn: number,
  confidence: number,
}

export type FramePrediction = PredictionBox[];

interface Progress {
  percent: number,
  displayText: string,
  frame?: FramePrediction
}

type modelOutputAction = {
  type: 'ADD';
  item: FramePrediction;
} | {
  type: 'CLEAR';
};

const modelOutputReducer = (state: FramePrediction[], action: modelOutputAction): FramePrediction[] => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.item];
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export type hiddenPredictionIndexesAction = {
  type: 'ADD';
  index: number;
} | {
  type: 'REMOVE';
  index: number;
} | {
  type: 'TOGGLE';
  index: number;
} | {
  type: 'CLEAR';
};

const hiddenPredictionIndexesReducer = (state: Set<number>, action: hiddenPredictionIndexesAction): Set<number> => {
  switch (action.type) {
    case 'CLEAR':
      return new Set<number>();
    case 'TOGGLE':
      if (state.has(action.index)) {
        state.delete(action.index);
      } else {
        state.add(action.index);
      }

      return new Set(state);
    default:
      return state;
  }
};


const DetectAccidentPanel: React.FC = () => {
  const [
    videoPath,
    startTime,
    endTime,
    setTabsDisabledState,
    selectedTabIndex,
  ] = useEditVideoModalStore((state) => [
    state.videoPath,
    state.sliderMarkers.start,
    state.sliderMarkers.end,
    state.setTabsDisabledState,
    state.selectedTabIndex
  ]);
  const [loadingText, setLoadingText] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<Progress>({ percent: 0, displayText: "0%"});
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);
  const [isFrameTransitionDone, setIsFrameTransitionDone] = useState<boolean>(false);
  const [isPredictionDone, setIsPredictionDone] = useState<boolean>(false);

  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [iouThreshold, setIouThreshold] = useState(50);
  
  const [modelOutput, dispatchModelOutput] = useReducer(modelOutputReducer, []);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [bestPrediction, setBestPrediction] = useState({ frame: -1, box: -1 });

  const [hiddenPredictionIndexes, dispatchHiddenPredictionIndexes] = useReducer(hiddenPredictionIndexesReducer, new Set<number>());

  const transitionAnimationFrameId = useRef<number | null>(null);

  const detectAccidentsMutation = useMutation(
    async () => await window.electronAPI.runAccidentDetectionModel(confidenceThreshold, iouThreshold),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Detecting accidents...")
      },
      onSuccess: (data) => {
        console.log(`Python accident detection model script exit code: ${data}`)
        
        setTimeout(() => {
          window.electronAPI.removeRunAccidentDetectionModelProgressListener();
          setIsPredictionDone(true);
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
      onSuccess: (_) => {
        setLoadingProgress({ percent: 100, displayText: "100%" });

        setTimeout(() => {
          window.electronAPI.removeTrimProgressListener();
          extractFramesMutation.mutate();
        }, 300);
      }
    }
  );

  const handleOnProgress = (progress: Progress) => {
    if (progress) {
      setLoadingProgress(progress)
    }
  };

  const handleOnRunAccidentDetectionModelProgress = (progress: Progress) => {
    if (progress) {
      setLoadingProgress({
        displayText: progress.displayText,
        percent: progress.percent
      })

      if (progress.frame !== undefined) {
        dispatchModelOutput({ type: 'ADD', item: progress.frame})
      }
    }
  };

  const rerunModel = () => {
    dispatchModelOutput({ type: 'CLEAR' });
    dispatchHiddenPredictionIndexes({ type: 'CLEAR' });
    setSelectedFrame(0);
    setBestPrediction({ frame: -1, box: -1 });
    
    setIsPredictionDone(false);
    setIsFrameTransitionDone(false);
    setIsLoadingDone(false);
    setTabsDisabledState(true);

    window.electronAPI.onRunAccidentDetectionModelProgress(handleOnRunAccidentDetectionModelProgress);
    detectAccidentsMutation.mutate();
  };

  useEffect(() => {
    if (isFrameTransitionDone) {
      console.log("clear hidden prediction indexes");
      dispatchHiddenPredictionIndexes({ type: 'CLEAR' });
    }
  }, [selectedFrame]);

  useEffect(() => {
    if (isPredictionDone) {
      const selectBestPrediction = () => {
        setLoadingText("Selecting best prediction...");

        let highestConfidence = 0;
        let bestFrameIndex = -1;
        let bestPredictionIndex = -1;
    
        modelOutput.forEach((framePrediction, frameIndex) => {
          framePrediction.forEach((prediction, predictionIndex) => {
            if (prediction.confidence > highestConfidence) {
              highestConfidence = prediction.confidence;
              bestFrameIndex = frameIndex;
              bestPredictionIndex = predictionIndex;
            }
          });
        });
    
        console.log(`Best prediction: frame ${bestFrameIndex} at box #${bestPredictionIndex} with confidence: ${highestConfidence}`);
    
        if (bestPredictionIndex !== -1) {
          setBestPrediction({ frame: bestFrameIndex, box: bestPredictionIndex });

          const startFrame = selectedFrame;
          const endFrame = bestFrameIndex;
          const steps = Math.abs(endFrame - startFrame);
          let currentStep = 0;
  
          const animate = () => {
            setSelectedFrame(startFrame + Math.round((endFrame - startFrame) * (currentStep / steps)));
            currentStep++;
  
            if (currentStep <= steps) {
              transitionAnimationFrameId.current = requestAnimationFrame(animate);
            } else {
              if (transitionAnimationFrameId.current) {
                cancelAnimationFrame(transitionAnimationFrameId.current);
                setIsFrameTransitionDone(true);
              }
            }
          };

          animate();
        }        
      }
      selectBestPrediction();
      setIsLoadingDone(true);
      setTabsDisabledState(false);
    }

    return () => {
      if (transitionAnimationFrameId.current) {
        cancelAnimationFrame(transitionAnimationFrameId.current);
      }
    }
  }, [isPredictionDone]);

  useEffect(() => {
    console.log(`DetectAccidentPanel: selectedTabIndex: ${selectedTabIndex}`)
    if (selectedTabIndex === 1) {
      dispatchModelOutput({ type: 'CLEAR' });
      dispatchHiddenPredictionIndexes({ type: 'CLEAR' });
      setSelectedFrame(0);
      setBestPrediction({ frame: -1, box: -1 });
      
      setIsPredictionDone(false);
      setIsFrameTransitionDone(false);
      setIsLoadingDone(false);
      setTabsDisabledState(true);

      trimMutation.mutate();
      
      window.electronAPI.onTrimProgress(handleOnProgress)

      window.electronAPI.onExtractFramesProgress(handleOnProgress)

      window.electronAPI.onRunAccidentDetectionModelProgress(handleOnRunAccidentDetectionModelProgress)
    }

    return () => {
      if (selectedTabIndex === 1) {
        window.electronAPI.killPythonProcess();
      }
      window.electronAPI.removeTrimProgressListener();
      window.electronAPI.removeExtractFramesProgressListener();
      window.electronAPI.removeRunAccidentDetectionModelProgressListener();
      console.log("DetectAccidentPanel progress listeners removed");
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-gray-50 flex flex-col overflow-y-auto">
      {isLoadingDone ? (
        <div className='w-full flex flex-col justify-start items-center p-4 gap-2'>
          <button
            disabled={!isFrameTransitionDone}
            className={`bg-transparent text-color-primary p-0 self-end hover:font-semibold ${isFrameTransitionDone ? 'cursor-pointer' : 'opacity-30 pointer-events-none'}}`}
            onClick={() => setSelectedFrame(bestPrediction.frame)}
          >
            Select best prediction
          </button>
          <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex flex-row gap-4'>
              <SelectFrameImage 
                selectedFrame={selectedFrame} 
                prediction={modelOutput[selectedFrame]}
                isFrameTransitionDone={isFrameTransitionDone}
                hiddenPredictionIndexes={hiddenPredictionIndexes}
              />

              <div className='flex flex-col gap-4'>
                <FrameDescription 
                  prediction={modelOutput[selectedFrame]} 
                  selectedFrame={selectedFrame}
                  bestPrediction={bestPrediction}
                  hiddenPredictionIndexes={hiddenPredictionIndexes}
                  dispatchHiddenPredictionIndexes={dispatchHiddenPredictionIndexes}
                  isFrameTransitionDone={isFrameTransitionDone}
                />
                <DetectAccidentModelHandler 
                  confidenceThreshold={confidenceThreshold}
                  setConfidenceThreshold={setConfidenceThreshold}
                  iouThreshold={iouThreshold}
                  setIouThreshold={setIouThreshold}
                  rerunModel={rerunModel}
                />
              </div>          
            </div>

            <FramePagination 
              selectedFrame={selectedFrame}
              setSelectedFrame={setSelectedFrame}
              modelOutput={modelOutput} 
            />
          </div>
        </div>
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

export default DetectAccidentPanel;
