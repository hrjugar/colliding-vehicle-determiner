import { useShallow } from "zustand/react/shallow";
import { useRef, useState } from "react";
import { FramePagination } from "@renderer/components/FramePagination";
import useVehicleIdentificationPanelStore from "./store";
import { useLoaderData } from "react-router-dom";

const SelectedObjectFramePagination: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [
    getSelectedObject,
    selectedFrame,
    setSelectedFrame,
  ] = useVehicleIdentificationPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.selectedFrame,
      state.setSelectedFrame,
      state.selectedObjectId,
    ])
  );

  const selectedObject = getSelectedObject();

  return (
    <FramePagination 
      selectedFrameIndex={selectedObject?.frames.findIndex((frame) => frame.frame === selectedFrame) ?? -1}
      setSelectedFrameIndex={(selectedFrameIndex) => setSelectedFrame(selectedObject?.frames[selectedFrameIndex].frame ?? -1)}
      frameList={selectedObject?.frames.map((frame) => frame.frame) || []}
      isFrameFromIndex={false}
      imgSrcPrefix={`fileHandler://frame//${video.id}//`}
      cardTitle={'Object Frames'}
      maxPageButtonsShown={3}
    />
  );
};

export default SelectedObjectFramePagination;
