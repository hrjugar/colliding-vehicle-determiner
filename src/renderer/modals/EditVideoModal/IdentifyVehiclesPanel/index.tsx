import { Tab } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import useEditVideoModalStore from '../store';
import { useShallow } from 'zustand/react/shallow';
import useIdentifyVehiclesPanelStore from './store';
import DetectedObjects from './DetectedObjects';
import SelectedObjectFramePagination from './SelectedObjectFramePagination';
import SelectedFrameObject from './SelectedFrameObject';
import IdentifyVehiclesModelHandler from './IdentifyVehiclesModelHandler';
import LoadingProgress from '@renderer/components/LoadingProgress';
import IdentifyVehiclesVideoPlayer from './IdentifyVehiclesVideoPlayer';
import { vehicleClassifications } from './constants';
import { getInvolvedVehicles } from './utils';

const IdentifyVehiclesPanel: React.FC = () => {
  const [
    selectedTabIndex,
    selectTab,
    setTabsDisabledState,
    isAccidentDetectionModelChanged,
    setIsAccidentDetectionModelChanged,
    setFinalDeepSORTModel,
    setFinalDeepSORTOutput,
    finalAccidentFrame,
    finalAccidentArea,
    setBestAccidentFrameVehicleOne,
    setBestAccidentFrameVehicleTwo,
    setFinalAccidentFrameVehicleOne,
    setFinalAccidentFrameVehicleTwo,
  ] = useEditVideoModalStore( 
    useShallow((state) => [
      state.selectedTabIndex,
      state.selectTab,
      state.setTabsDisabledState,
      state.isAccidentDetectionModelChanged,
      state.setIsAccidentDetectionModelChanged,
      state.setFinalDeepSORTModel,
      state.setFinalDeepSORTOutput,
      state.finalAccidentFrame,
      state.finalAccidentArea,
      state.setBestAccidentFrameVehicleOne,
      state.setBestAccidentFrameVehicleTwo,
      state.setFinalAccidentFrameVehicleOne,
      state.setFinalAccidentFrameVehicleTwo,
    ])
  )

  const [
    loadingText,
    setLoadingText,
    loadingProgress,
    setLoadingProgress,
    isLoadingDone,
    setIsLoadingDone,
    selectedYOLOModel,
    deepSORTOutput,
    setDeepSORTOutput,
    getSelectedObject,
    setSelectedFrame,
    resetModelStates,
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.loadingText,
      state.setLoadingText,
      state.loadingProgress,
      state.setLoadingProgress,
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.selectedYOLOModel,
      state.deepSORTOutput,
      state.setDeepSORTOutput,
      state.getSelectedObject,
      state.setSelectedFrame,
      state.resetModelStates,
      state.selectedObjectId,
    ])
  )
  
  const selectedObject = getSelectedObject();

  const handleOnProgress = (progress: Progress) => {
    if (progress) {
      setLoadingProgress(progress)
    }
  };

  const copyVideoMutation = useMutation(
    async () => await window.electronAPI.copyDeepSORTVideo(),
    {
      onMutate: () => {
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Getting video with labelled vehicles...");
      },
      onSuccess: (_) => {
        console.log("Finished copying video.");
        setLoadingProgress({ percent: 100, displayText: "Loading Python script" });

        setTimeout(() => {
          setIsAccidentDetectionModelChanged(false);
          setIsLoadingDone(true);
          setTabsDisabledState(false);
        }, 300);
      },
    }
  )

  const deepSORTMutation = useMutation(
    async () => await window.electronAPI.runDeepSORTModel(selectedYOLOModel),
    {
      onMutate: () => {
        window.electronAPI.onRunDeepSORTModelProgress(handleOnProgress);
        setLoadingProgress({ percent: 0, displayText: "Loading Python script" });
        setLoadingText("Identifying vehicles...");
      },
      onSuccess: (data) => {
        console.log(`Python DeepSORT script exit code: ${data}`)
        window.electronAPI.removeRunDeepSORTModelProgressListener();
        setDeepSORTOutput(data);
        setFinalDeepSORTModel(selectedYOLOModel);
        setFinalDeepSORTOutput(data);

        setTimeout(() => {
          copyVideoMutation.mutate();
        }, 300);
      }
    }
  )

  const rerunModel = () => {
    resetModelStates(true);
    setTabsDisabledState(true);
    deepSORTMutation.mutate();
  }

  useEffect(() => {
    if (deepSORTOutput.length === 0) return;
    
    const [predictedVehicleOne, predictedVehicleTwo] = getInvolvedVehicles(deepSORTOutput, finalAccidentFrame, finalAccidentArea);
    setBestAccidentFrameVehicleOne(predictedVehicleOne);
    setBestAccidentFrameVehicleTwo(predictedVehicleTwo);
  }, [deepSORTOutput]);
  
  useEffect(() => {
    console.log("IN IdentifyVehiclesPanel");
    console.log(`isAccidentDetectionModelChanged: ${isAccidentDetectionModelChanged}`);
    if (selectedTabIndex === 2 && isAccidentDetectionModelChanged) {
      resetModelStates();
      setTabsDisabledState(true);
      deepSORTMutation.mutate();
    }

    return () => {
      window.electronAPI.removeRunDeepSORTModelProgressListener();
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-start items-start overflow-y-auto gap-4 p-4">
      {isLoadingDone ? (
        <>
          <div className='w-full flex flex-row gap-4'>
            <button
              disabled={!isLoadingDone}
              className='disabled:pointer-events-none disabled:opacity-50 ml-auto hover:font-semibold'
              onClick={() => {
                setFinalAccidentFrameVehicleOne(undefined);
                setFinalAccidentFrameVehicleTwo(undefined);
                selectTab(3)
              }}
            >Mark as invalid</button>
            <button 
              disabled={!isLoadingDone || !selectedObject || !finalAccidentFrame || !selectedObject.frames.some((frame) => frame.frame === finalAccidentFrame)}
              className='disabled:pointer-events-none disabled:opacity-50 hover:font-semibold'
              onClick={() => {
                if (finalAccidentFrame && selectedObject) {
                  setSelectedFrame(finalAccidentFrame);
                }
              }}
            >Select accident frame</button>
          </div>
          <div className='w-full flex flex-row gap-4 max-h-[60vh]'>
            <div className='flex flex-col gap-4 h-full'>
              <DetectedObjects />
              <IdentifyVehiclesModelHandler rerunModel={rerunModel} />
            </div>
            <IdentifyVehiclesVideoPlayer />
          </div>

          <div className='w-full flex-grow flex flex-row gap-4'>
            <SelectedObjectFramePagination />
            <SelectedFrameObject />
          </div>
        </>
        // <div className='w-full self-stretch flex flex-col justify-start gap-4 p-4'>
        // </div>
      ) : (
        <LoadingProgress 
          loadingText={loadingText}
          loadingProgress={loadingProgress}
        />
      )}
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
