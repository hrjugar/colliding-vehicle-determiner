import { Tab } from '@headlessui/react';
import { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import DetectAccidentModelHandler from './DetectAccidentModelHandler';
import FrameDescription from './FrameDescription';
import SelectedFrameImage from './SelectedFrameImage';
import useEditVideoModalStore from "../store";
import { useShallow } from 'zustand/react/shallow';
import { AccidentDetectionModelProgress } from './types';
import useDetectAccidentPanelStore from './store';
import DetectAccidentFramePagination from './DetectAccidentFramePagination';
import LoadingProgress from '@renderer/components/LoadingProgress';

const DetectAccidentPanel: React.FC = () => {
  const [
    videoPath,
    startTime,
    endTime,
    setTabsDisabledState,
    setIsAccidentDetectionModelChanged,
    selectedTabIndex,
    selectTab,
    isTrimmedPortionChanged,
    setIsTrimmedPortionChanged,
    setFinalAccidentModelConfidenceThreshold,
    setFinalAccidentModelIOUThreshold,
    setFinalAccidentFrame,
    setFinalAccidentArea,
    setFinalAccidentFrameVehicleOne,
    setFinalAccidentFrameVehicleTwo,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoPath,
      state.sliderMarkers.start,
      state.sliderMarkers.end,
      state.setTabsDisabledState,
      state.setIsAccidentDetectionModelChanged,
      state.selectedTabIndex,
      state.selectTab,
      state.isTrimmedPortionChanged,
      state.setIsTrimmedPortionChanged,
      state.setFinalAccidentModelConfidenceThreshold,
      state.setFinalAccidentModelIOUThreshold,
      state.setFinalAccidentFrame,
      state.setFinalAccidentArea,
      state.setFinalAccidentFrameVehicleOne,
      state.setFinalAccidentFrameVehicleTwo,
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
  const imageSideCardsDivRef = useRef<HTMLDivElement>(null);

  const handleOnProgress = (progress: AccidentDetectionModelProgress) => {
    if (progress) {
      setLoadingProgress(progress)
    }
  };

  const handleOnRunAccidentDetectionModelProgress = (progress: AccidentDetectionModelProgress) => {
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

  const detectAccidentsMutation = useMutation(
    async () => await window.electronAPI.runAccidentDetectionModel(confidenceThreshold, iouThreshold),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Detecting accidents...")
        window.electronAPI.onRunAccidentDetectionModelProgress(handleOnRunAccidentDetectionModelProgress)
      },
      onSuccess: (data) => {
        console.log(`Python accident detection model script exit code: ${data}`)
        window.electronAPI.removeRunAccidentDetectionModelProgressListener();
        
        setTimeout(() => {
          setFinalAccidentModelConfidenceThreshold(confidenceThreshold);
          setFinalAccidentModelIOUThreshold(iouThreshold);

          setIsPredictionDone(true);
          setIsTrimmedPortionChanged(false);
          setIsAccidentDetectionModelChanged(true);
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
        window.electronAPI.onExtractFramesProgress(handleOnProgress)
      },
      onSuccess: (_) => {
        setLoadingProgress({ percent: 100, displayText: "100%" });
        window.electronAPI.removeExtractFramesProgressListener();

        setTimeout(() => {
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
        window.electronAPI.onTrimProgress(handleOnProgress);
      },
      onSuccess: (_) => {
        setLoadingProgress({ percent: 100, displayText: "100%" });
        window.electronAPI.removeTrimProgressListener();

        setTimeout(() => {
          extractFramesMutation.mutate();
        }, 300);
      }
    }
  );

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
      setFinalAccidentFrame(bestFrameIndex + 1);
      setFinalAccidentArea({
        x: allPredictions[bestFrameIndex][bestPredictionIndex].x,
        y: allPredictions[bestFrameIndex][bestPredictionIndex].y,
        w: allPredictions[bestFrameIndex][bestPredictionIndex].w,
        h: allPredictions[bestFrameIndex][bestPredictionIndex].h,
        xn: allPredictions[bestFrameIndex][bestPredictionIndex].xn,
        yn: allPredictions[bestFrameIndex][bestPredictionIndex].yn,
        wn: allPredictions[bestFrameIndex][bestPredictionIndex].wn,
        hn: allPredictions[bestFrameIndex][bestPredictionIndex].hn,
      });

      // const startFrameIndex = selectedFrameIndex;
      // const endFrameIndex = bestFrameIndex;
      // const steps = Math.abs(endFrameIndex - startFrameIndex);
      // let currentStep = 0;

      // const animate = () => {
      //   setSelectedFrameIndex(startFrameIndex + Math.round((endFrameIndex - startFrameIndex) * (currentStep / steps)));
      //   currentStep++;

      //   if (currentStep <= steps) {
      //     transitionAnimationFrameId.current = requestAnimationFrame(animate);
      //   } else {
      //     if (transitionAnimationFrameId.current) {
      //       cancelAnimationFrame(transitionAnimationFrameId.current);
      //       setIsFrameTransitionDone(true);
      //     }
      //   }
      // };

      // animate();
      setSelectedFrameIndex(bestFrameIndex);
      setIsFrameTransitionDone(true);

      setIsLoadingDone(true);
      setTabsDisabledState(false);
    } else {
      setFinalAccidentFrame(undefined);
      setFinalAccidentArea(undefined);
      setFinalAccidentFrameVehicleOne(undefined);
      setFinalAccidentFrameVehicleTwo(undefined);

      setIsLoadingDone(true);
      setTabsDisabledState(false);

      selectTab(3);
    }
  }

  const rerunModel = () => {
    resetModelStates(true);
    setTabsDisabledState(true);
    detectAccidentsMutation.mutate();
  };

  useEffect(() => {
    if (isPredictionDone) {
      selectBestPrediction();
    }
  }, [isPredictionDone])

  useEffect(() => {
    if (isFrameTransitionDone) {
      console.log("clear hidden prediction indexes");
      clearHiddenPredictionBoxIndexes();
    }
  }, [selectedFrameIndex]);

  useEffect(() => {
    console.log(`DetectAccidentPanel: selectedTabIndex: ${selectedTabIndex}`)

    if (selectedTabIndex === 1 && isTrimmedPortionChanged) {
      resetModelStates();
      setTabsDisabledState(true);
      trimMutation.mutate();
    }

    return () => {
      if (transitionAnimationFrameId.current) {
        cancelAnimationFrame(transitionAnimationFrameId.current);
      }

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
        <div className='w-full flex flex-col justify-start items-center p-4 gap-2 flex-grow'>
          <button
            disabled={!isFrameTransitionDone}
            className={`bg-transparent text-color-primary p-0 self-end hover:font-semibold ${isFrameTransitionDone ? 'cursor-pointer' : 'opacity-30 pointer-events-none'}}`}
            onClick={() => setSelectedFrameIndex(bestPredictionBoxIndexes.frameIndex)}
          >
            Select best prediction
          </button>
          <div className='flex flex-col w-full gap-4 flex-grow'>
            <div className='flex flex-row gap-4 flex-grow '>
              <SelectedFrameImage imageSideCardsDivRef={imageSideCardsDivRef}/>

              <div className='flex flex-col gap-4 flex-grow' ref={imageSideCardsDivRef}>
                <FrameDescription />
                <DetectAccidentModelHandler rerunModel={rerunModel} />
              </div>          
            </div>

            <DetectAccidentFramePagination />
          </div>
        </div>
      ) : (
        <div className='p-4 w-full h-full flex justify-center items-center'>
          <LoadingProgress 
            loadingText={loadingText}
            loadingProgress={loadingProgress}
          /> 
        </div>
      )}
    </Tab.Panel>
  );
};

export default DetectAccidentPanel;
