import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";
import { useRef, useState } from "react";
import { FramePagination } from "@/components/FramePagination";

const SelectedObjectFramePagination: React.FC = () => {
  const [
    getSelectedObject,
    setSelectedFrame,
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.setSelectedFrame,
      state.selectedObjectId,
    ])
  );

  const selectedObject = getSelectedObject();

  return (
    <FramePagination 
      imgSrcPrefix={`fileHandler://tempFrame//`}
      frameList={selectedObject ? selectedObject.frames.map((frame) => frame.frame) : []}
      selectFrameCallback={(selectedFrame) => setSelectedFrame(selectedFrame)}
      cardTitle={'Object Frames'}
      maxPageButtonsShown={3}
    />
  );
};

export default SelectedObjectFramePagination;
