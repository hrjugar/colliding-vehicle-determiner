import { useShallow } from "zustand/react/shallow";
import useEditVideoModalStore from "../store";
import { useEffect, useState } from "react";
import useEndPanelStore from "./store";
import LoadingProgress from "@renderer/components/LoadingProgress";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EndPanel: React.FC = () => {
  const [
    videoPath,
    selectedTabIndex,
    selectTab,
    closeModal,
    setTabsDisabledState,
    fps,
    sliderMarkers,
    finalAccidentModelConfidenceThreshold,
    finalAccidentModelIOUThreshold,
    finalDeepSORTModel,
    finalDeepSORTOutput,
    finalAccidentFrame,
    finalAccidentArea,
    finalAccidentFrameVehicleOne,
    finalAccidentFrameVehicleTwo,
    setFinalAccidentFrameVehicleOne,
    setFinalAccidentFrameVehicleTwo,
    finalAccidentFrameVehicleOneProbability,
    finalAccidentFrameVehicleTwoProbability,
    setFinalAccidentFrameVehicleOneProbability,
    setFinalAccidentFrameVehicleTwoProbability,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoPath,
      state.selectedTabIndex,
      state.selectTab,
      state.closeModal,
      state.setTabsDisabledState,
      state.fps,
      state.sliderMarkers,
      state.finalAccidentModelConfidenceThreshold,
      state.finalAccidentModelIOUThreshold,
      state.finalDeepSORTModel,
      state.finalDeepSORTOutput,
      state.finalAccidentFrame,
      state.finalAccidentArea,
      state.finalAccidentFrameVehicleOne,
      state.finalAccidentFrameVehicleTwo,
      state.setFinalAccidentFrameVehicleOne,
      state.setFinalAccidentFrameVehicleTwo,
      state.finalAccidentFrameVehicleOneProbability,
      state.finalAccidentFrameVehicleTwoProbability,
      state.setFinalAccidentFrameVehicleOneProbability,
      state.setFinalAccidentFrameVehicleTwoProbability,
    ])
  )

  const [
    loadingText,
    setLoadingText,
    loadingProgress,
    setLoadingProgress,
    isLoadingDone,
    setIsLoadingDone,
    isPredictionDone,
    setIsPredictionDone,
    resetStates,
  ] = useEndPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.isPredictionDone,
      state.setIsPredictionDone,
      state.resetStates,
    ])
  )

  const navigate = useNavigate();

  const insertVideoMutation = useMutation(
    async (videoDataInput: VideoDataInput) => await window.electronAPI.insertVideo(videoDataInput),
    {
      onMutate: () => {
        setTabsDisabledState(true);
        setLoadingText('Inserting video into database...');
        setLoadingProgress({ displayText: '0%', percent: 0 });
      },
      onSuccess: (id) => {
        setLoadingProgress({ displayText: '100%', percent: 100 })

        setTimeout(() => {
          setIsLoadingDone(true);
          closeModal();
          resetStates();
          navigate(`/videos/${id}`);
        }, 300);
      },
      onError: (err) => {
        setIsLoadingDone(true);
        closeModal();

        if (err instanceof Error) {
          toast.error(err.message);
        } else if (typeof err === 'string') {
          toast.error(err);
        } else {
          toast.error('Something went wrong.');
        }
      }
    }
  )

  const handleGRUProgress = (progress: GRUModelProgress) => {
    if (progress) {
      setLoadingProgress({
        displayText: progress.displayText,
        percent: progress.percent
      })

      if (progress.classifier !== undefined) {
        console.log(`acquired GRU results: ${progress.classifier}`)
        setFinalAccidentFrameVehicleOneProbability(progress.classifier["vehicleOne"]);
        setFinalAccidentFrameVehicleTwoProbability(progress.classifier["vehicleTwo"]);
      }
    }
  };

  const gruMutation = useMutation(
    async (gruInput: (number | null)[][]) => await window.electronAPI.runGRUModel(gruInput),
    {
      onMutate: () => {
        window.electronAPI.onRunGRUModelProgress(handleGRUProgress);
        setLoadingText('Determining the colliding vehicles in the accident...');
        setLoadingProgress({ displayText: '0%', percent: 0 });
      },
      onSuccess: (data) => {
        console.log(`Python DeepSORT script exit code: ${data}`)
        window.electronAPI.removeRunGRUModelProgressListener();

        setLoadingProgress({ displayText: '100%', percent: 100 });
        setIsPredictionDone(true);
      }
    }
  )

  useEffect(() => {
    if (isLoadingDone) {

    }
  }, [isLoadingDone]);

  useEffect(() => {
    if (isPredictionDone) {
      console.log("PREDICTION IS DONE");

      const videoDataInput: VideoDataInput = {
        path: videoPath,
        trimStart: sliderMarkers.start,
        trimEnd: sliderMarkers.end,
        fps,
        accidentModelConfidenceThreshold: finalAccidentModelConfidenceThreshold,
        accidentModelIOUThreshold: finalAccidentModelIOUThreshold,
        deepSORTModel: finalDeepSORTModel,
        accidentFrame: finalAccidentFrame,
        accidentArea: finalAccidentArea,
      };

      if (finalAccidentFrameVehicleOne === undefined || finalAccidentFrameVehicleTwo === undefined) {
        insertVideoMutation.mutate(videoDataInput);
        console.log(`videoDataInput without vehicles:`)
        console.log(videoDataInput)
      } else {
        console.log(`acquired probabilities!`)
        videoDataInput.accidentFrameVehicleOne = { ...finalAccidentFrameVehicleOne, probability: finalAccidentFrameVehicleOneProbability! };
        videoDataInput.accidentFrameVehicleTwo = { ...finalAccidentFrameVehicleTwo, probability: finalAccidentFrameVehicleTwoProbability! };
        console.log(`videoDataInput with probabilities:`)
        console.log(videoDataInput)
        insertVideoMutation.mutate(videoDataInput);          
      }
    }
  }, [isPredictionDone]);

  useEffect(() => {
    if (selectedTabIndex === 3) {
      // if (
      //   (finalAccidentFrameVehicleOne !== undefined && finalAccidentFrameVehicleTwo === undefined) ||
      //   (finalAccidentFrameVehicleOne === undefined && finalAccidentFrameVehicleTwo !== undefined)
      // ) {
      //   toast.error('Please select two vehicles involved in the accident.');
      //   selectTab(2);
      //   return;
      // }
      resetStates();

      let gruInput: (number | null)[][] = [];

      if (
        finalAccidentFrameVehicleOne !== undefined && 
        finalAccidentFrameVehicleOne !== null  && 
        finalAccidentFrameVehicleTwo !== undefined &&
        finalAccidentFrameVehicleTwo !== null
      ) {
        let mostFinalAccidentFrameVehicleOne = finalAccidentFrameVehicleOne;
        let mostFinalAccidentFrameVehicleTwo = finalAccidentFrameVehicleTwo;

        if (
          finalAccidentFrameVehicleOne.x > finalAccidentFrameVehicleTwo.x ||
          (finalAccidentFrameVehicleOne.x === finalAccidentFrameVehicleTwo.x && finalAccidentFrameVehicleOne.y > finalAccidentFrameVehicleTwo.y) ||
          (finalAccidentFrameVehicleOne.x === finalAccidentFrameVehicleTwo.x && finalAccidentFrameVehicleOne.y === finalAccidentFrameVehicleTwo.y && finalAccidentFrameVehicleOne.w < finalAccidentFrameVehicleTwo.w) ||
          (finalAccidentFrameVehicleOne.x === finalAccidentFrameVehicleTwo.x && finalAccidentFrameVehicleOne.y === finalAccidentFrameVehicleTwo.y && finalAccidentFrameVehicleOne.w === finalAccidentFrameVehicleTwo.w && finalAccidentFrameVehicleOne.h < finalAccidentFrameVehicleTwo.h)
        ) {
          mostFinalAccidentFrameVehicleOne = finalAccidentFrameVehicleTwo;
          mostFinalAccidentFrameVehicleTwo = finalAccidentFrameVehicleOne;

          setFinalAccidentFrameVehicleOne(mostFinalAccidentFrameVehicleOne);
          setFinalAccidentFrameVehicleTwo(mostFinalAccidentFrameVehicleTwo);
        }

        const vehicleOneDeepSORTObject = finalDeepSORTOutput.find((deepSORTObject) => deepSORTObject.id === mostFinalAccidentFrameVehicleOne.id);
        const vehicleTwoDeepSORTObject = finalDeepSORTOutput.find((deepSORTObject) => deepSORTObject.id === mostFinalAccidentFrameVehicleTwo.id);

        
        const involvedVehicleFramesData: { [key: number]: BoundingBoxWithVehicle[] } = {};

        for (const frameItem of vehicleOneDeepSORTObject!.frames) {
          const frameData = involvedVehicleFramesData[frameItem.frame];
          const currentVehicleFrame = {
            vehicle: 1,
            x: frameItem.x,
            y: frameItem.y,
            w: frameItem.w,
            h: frameItem.h,
            xn: frameItem.xn,
            yn: frameItem.yn,
            wn: frameItem.wn,
            hn: frameItem.hn,
          };

          if (frameData) {
            involvedVehicleFramesData[frameItem.frame].push(currentVehicleFrame);
          } else {
            involvedVehicleFramesData[frameItem.frame] = [currentVehicleFrame];
          }
        }

        for (const frameItem of vehicleTwoDeepSORTObject!.frames) {
          const frameData = involvedVehicleFramesData[frameItem.frame];
          const currentVehicleFrame = {
            vehicle: 2,
            x: frameItem.x,
            y: frameItem.y,
            w: frameItem.w,
            h: frameItem.h,
            xn: frameItem.xn,
            yn: frameItem.yn,
            wn: frameItem.wn,
            hn: frameItem.hn,
          };

          if (frameData) {
            involvedVehicleFramesData[frameItem.frame].push(currentVehicleFrame);
          } else {
            involvedVehicleFramesData[frameItem.frame] = [currentVehicleFrame];
          }
        }

        console.log(`Involved Vehicle Frames Data:`)
        console.log(involvedVehicleFramesData);

        const involvedVehicleFrames = Object.keys(involvedVehicleFramesData);
        involvedVehicleFrames.sort();

        const involvedVehicleFramesArray: BoundingBoxWithVehicle[][] = [];
        for (const frame of involvedVehicleFrames) {
          involvedVehicleFramesArray.push(involvedVehicleFramesData[parseInt(frame)])
        }

        console.log(`Involved Vehicle Frames Array:`)
        console.log(involvedVehicleFramesArray);

        gruInput = [];
        for (const frameData of involvedVehicleFramesArray) {
          const frameRow: (number | null)[] = [];

          const vehicleOneFrameData = frameData.find((frameItem) => frameItem.vehicle === 1);
          const vehicleTwoFrameData = frameData.find((frameItem) => frameItem.vehicle === 2);

          if (vehicleOneFrameData) {
            frameRow.push(vehicleOneFrameData.xn, vehicleOneFrameData.yn, vehicleOneFrameData.wn, vehicleOneFrameData.hn);
          } else {
            frameRow.push(null, null, null, null);
          }

          if (vehicleTwoFrameData) {
            frameRow.push(vehicleTwoFrameData.xn, vehicleTwoFrameData.yn, vehicleTwoFrameData.wn, vehicleTwoFrameData.hn);
          } else {
            frameRow.push(null, null, null, null);
          }

          gruInput.push(frameRow);
        }
      }

      console.log(`GRU Input: ${gruInput}`)

      gruMutation.mutate(gruInput);
    }

    return () => {
      window.electronAPI.removeRunGRUModelProgressListener();
    }
  }, [selectedTabIndex]);
  
  return (
    <div className="w-full h-full flex justify-center items-center px-4">
      <LoadingProgress 
        loadingText={loadingText}
        loadingProgress={loadingProgress}
      />
    </div>
  );
};

export default EndPanel;
