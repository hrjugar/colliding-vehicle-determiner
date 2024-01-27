import { Tab } from "@headlessui/react"
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useLoaderData } from "react-router-dom";
import useVehicleIdentificationPanelStore from "./store";
import { useShallow } from "zustand/react/shallow";
import VehicleIdentificationVideoPlayer from "./VehicleIdentificationVideoPlayer";
import DetectedObjects from "./DetectedObjects";
import ModelDetails from "./ModelDetails";
import SelectedObjectFramePagination from "./SelectedObjectFramePagination";
import SelectedFrameObject from "./SelectedFrameObject";

const VehicleIdentificationPanel: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [
    isLoadingDone,
    setIsLoadingDone,
    deepSORTOutput,
    setDeepSORTOutput,
    resetStates,
  ] = useVehicleIdentificationPanelStore(
    useShallow((state) => [
      state.isLoadingDone,
      state.setIsLoadingDone,
      state.deepSORTOutput,
      state.setDeepSORTOutput,
      state.resetStates
    ])
  )

  const getResultsMutation = useMutation(
    async (id: number | bigint) => await window.electronAPI.getDeepSORTModelResults(id),
    {
      onSuccess: (data) => {
        setDeepSORTOutput(data);
        setIsLoadingDone(true);
      }
    }
  )

  useEffect(() => {
    if (video) {
      resetStates();
      getResultsMutation.mutate(video.id);
    }
  }, [video]);
  
  return (
    <Tab.Panel className="w-full h-full flex flex-col justify-start items-start overflow-y-auto gap-4">
      {isLoadingDone ? (
        <>
          <div className='w-full flex flex-row gap-4 max-h-[60vh]'>
            <div className='flex flex-col gap-4 h-full'>
              <DetectedObjects />
              <ModelDetails />
            </div>
            <VehicleIdentificationVideoPlayer />
          </div>

          <div className='w-full flex-grow flex flex-row gap-4'>
            <SelectedObjectFramePagination />
            <SelectedFrameObject />
          </div>        
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Tab.Panel>
  )
}

export default VehicleIdentificationPanel;