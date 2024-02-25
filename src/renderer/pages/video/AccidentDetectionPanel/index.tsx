import { Tab } from "@headlessui/react"
import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { useLoaderData } from "react-router-dom";
import useAccidentDetectionPanelStore from "./store";
import { useShallow } from "zustand/react/shallow";
import SelectedFrameImage from "./SelectedFrameImage";
import FrameDetections from "./FrameDetections";
import ModelDetails from "./ModelDetails";
import AccidentDetectionFramePagination from "./AccidentDetectionFramePagination";

const AccidentDetectionPanel: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [
    isPredictionDone,
    setIsPredictionDone,
    isLoadingDone,
    setIsLoadingDone,
    allPredictions,
    setAllPredictions,
    resetStates,
    selectedFrameIndex,
    setSelectedFrameIndex,
    bestPredictionBoxIndexes,
    setBestPredictionBoxIndexes,
    clearHiddenPredictionBoxIndexes
  ] = useAccidentDetectionPanelStore(
    useShallow((state) => [
      state.isPredictionDone,
      state.setIsPredictionDone,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.allPredictions,
      state.setAllPredictions,
      state.resetStates,
      state.selectedFrameIndex,
      state.setSelectedFrameIndex,
      state.bestPredictionBoxIndexes,
      state.setBestPredictionBoxIndexes,
      state.clearHiddenPredictionBoxIndexes
    ])
  )

  const imageSideCardsDivRef = useRef<HTMLDivElement>(null);

  const getResultsMutation = useMutation(
    async (id: number | bigint) => await window.electronAPI.getAccidentDetectionModelResults(id), 
    {
      onSuccess: (data) => {
        setIsPredictionDone(true);
        setAllPredictions(data);
      }
    }
  )
  

  useEffect(() => {
    if (video) {
      resetStates();
      getResultsMutation.mutate(video.id);
    }
  }, [video]);

  useEffect(() => {
    if (isLoadingDone) {
      clearHiddenPredictionBoxIndexes();
    }
  }, [selectedFrameIndex])

  useEffect(() => {
    if (isPredictionDone) {
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

      if (bestPredictionIndex !== -1) {
        setBestPredictionBoxIndexes({
          frameIndex: bestFrameIndex,
          boxIndex: bestPredictionIndex
        })
      }

      setIsLoadingDone(true);
    }
  }, [isPredictionDone]);
  
  return (
    <Tab.Panel className={`h-full flex flex-col flex-grow px-8`}>
      {isLoadingDone ? (
        <div className="flex flex-col gap-2 flex-grow pb-4">
          <button
            className="bg-transparent text-color-primary p-0 self-end hover:font-semibold cursor-pointer"
            onClick={() => setSelectedFrameIndex(bestPredictionBoxIndexes.frameIndex)}
          >
            Select best prediction
          </button>

          <div className="flex flex-row gap-2 flex-grow">
            <SelectedFrameImage imageSideCardsDivRef={imageSideCardsDivRef}/>
            <div className="flex flex-col gap-2" ref={imageSideCardsDivRef}>
              <FrameDetections />
              <ModelDetails />
            </div>
          </div>

          <AccidentDetectionFramePagination />
        </div>
      ) : (
        <p>Loading</p>
      )}
    </Tab.Panel>
  )
}

export default AccidentDetectionPanel;