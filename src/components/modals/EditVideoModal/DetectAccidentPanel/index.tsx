import { Tab } from '@headlessui/react';
import { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import FramePagination from './FramePagination';
import DetectAccidentModelHandler from './DetectAccidentModelHandler';
import FrameDescription from './FrameDescription';
import SelectFrameImage from './SelectedFrameImage';
import useEditVideoModalStore from "../store";
import { useShallow } from 'zustand/react/shallow';
import { Progress } from './types';
import useDetectAccidentPanelStore from './store';

const DetectAccidentPanel: React.FC = () => {
  const [
    videoPath,
    startTime,
    endTime,
    setTabsDisabledState,
    selectedTabIndex,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoPath,
      state.sliderMarkers.start,
      state.sliderMarkers.end,
      state.setTabsDisabledState,
      state.selectedTabIndex
    ])
  );

  const [
    loadingText,
    setLoadingText,
    loadingProgress,
    setLoadingProgress,

    isPredictionDone,
    setIsPredictionDone,
    isLoadingDone,
    setIsLoadingDone,
    isFrameTransitionDone,
    setIsFrameTransitionDone,

    confidenceThreshold,
    iouThreshold,
    
    allPredictions,
    addFramePredictions,
    
    selectedFrameIndex,
    setSelectedFrameIndex,

    bestPredictionBoxIndexes,
    setBestPredictionBoxIndexes,

    clearHiddenPredictionBoxIndexes,

    resetModelStates
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,

      state.isPredictionDone,
      state.setIsPredictionDone,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.isFrameTransitionDone,
      state.setIsFrameTransitionDone,

      state.confidenceThreshold,
      state.iouThreshold,

      state.allPredictions,
      state.addFramePredictions,

      state.selectedFrameIndex,
      state.setSelectedFrameIndex,

      state.bestPredictionBoxIndexes,
      state.setBestPredictionBoxIndexes,

      state.clearHiddenPredictionBoxIndexes,

      state.resetModelStates
    ])
  );

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
        addFramePredictions(progress.frame)
      }
    }
  };

  const rerunModel = () => {
    resetModelStates();
    window.electronAPI.onRunAccidentDetectionModelProgress(handleOnRunAccidentDetectionModelProgress);
    detectAccidentsMutation.mutate();
  };

  useEffect(() => {
    if (isFrameTransitionDone) {
      console.log("clear hidden prediction indexes");
      clearHiddenPredictionBoxIndexes();
    }
  }, [selectedFrameIndex]);

  useEffect(() => {
    if (isPredictionDone) {
      const selectBestPrediction = () => {
        setLoadingText("Selecting best prediction...");

        let highestConfidence = 0;
        let bestFrameIndex = -1;
        let bestPredictionIndex = -1;
    
        allPredictions.forEach((framePredictions, frameIndex) => {
          framePredictions.forEach((prediction, predictionIndex) => {
            if (prediction.confidence > highestConfidence) {
              highestConfidence = prediction.confidence;
              bestFrameIndex = frameIndex;
              bestPredictionIndex = predictionIndex;
            }
          });
        });
    
        console.log(`Best prediction: frame ${bestFrameIndex} at box #${bestPredictionIndex} with confidence: ${highestConfidence}`);
    
        if (bestPredictionIndex !== -1) {
          setBestPredictionBoxIndexes({ frameIndex: bestFrameIndex, boxIndex: bestPredictionIndex });

          const startFrameIndex = selectedFrameIndex;
          const endFrameIndex = bestFrameIndex;
          const steps = Math.abs(endFrameIndex - startFrameIndex);
          let currentStep = 0;
  
          const animate = () => {
            setSelectedFrameIndex(startFrameIndex + Math.round((endFrameIndex - startFrameIndex) * (currentStep / steps)));
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
      resetModelStates();

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
            onClick={() => setSelectedFrameIndex(bestPredictionBoxIndexes.frameIndex)}
          >
            Select best prediction
          </button>
          <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex flex-row gap-4'>
              <SelectFrameImage />

              <div className='flex flex-col gap-4'>
                <FrameDescription />
                <DetectAccidentModelHandler rerunModel={rerunModel} />
              </div>          
            </div>

            <FramePagination />
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
