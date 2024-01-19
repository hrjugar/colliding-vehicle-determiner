import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";
import { useRef, useState } from "react";
import { FramePagination } from "@/components/FramePagination";

const SelectedObjectFramePagination: React.FC = () => {
  const [
    getSelectedObject,
    selectedFrame,
    setSelectedFrame,
  ] = useIdentifyVehiclesPanelStore(
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
      imgSrcPrefix={`fileHandler://tempFrame//`}
      cardTitle={'Object Frames'}
      maxPageButtonsShown={3}
    />
  );
};

export default SelectedObjectFramePagination;
