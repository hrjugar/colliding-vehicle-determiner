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

  // const [rowFirstFrameIndex, setRowFirstFrameIndex] = useState<number>(0);
  // const [maxFramesPerRow, setMaxFramesPerRow] = useState<number>(5);
  // const framesContainerRef = useRef<HTMLDivElement>(null);

  // const rowLastFrameIndex = selectedObject ? Math.min(selectedObject.frames.length, rowFirstFrameIndex + maxFramesPerRow) : 0;
  // const currFramesPerRow = rowLastFrameIndex - rowFirstFrameIndex;

  return (
    <FramePagination 
      imgSrcPrefix={`fileHandler://tempFrame//`}
      frameList={selectedObject ? selectedObject.frames.map((frame) => frame.frame) : []}
      selectFrameCallback={(selectedFrame) => setSelectedFrame(selectedFrame)}
      cardTitle={'Object Frames'}
      maxPageButtonsShown={3}
    />
    // <div className="card w-full flex-grow flex flex-col">
    //   <div className="card-header">
    //     <h2>Object Frames</h2>
    //   </div>

    //   <div className="p-4 flex-grow flex flex-col justify-center items-center">
    //     <div
    //       className="w-full flex-grow flex flex-row flex-wrap gap-4 justify-center items-center bg-red-400 h-28"
    //       ref={framesContainerRef}
    //     >
    //       {selectedObject ? (
    //         selectedObject.frames.map((frame) => (
    //           <div
    //             key={`selected-object-frame-${frame.frame}`}
    //             className="flex flex-col items-center rounded-b-sm hover:shadow-around"
    //           >
    //             <img 
    //               src={`fileHandler://tempFrame//${frame.frame}`} 
    //               className="object-contain h-20 inset-0"
    //             />
    //             <p className="flex-grow h-full text-sm font-semibold p-1">{frame.frame}</p>
    //           </div>
    //         ))
    //       ) : (
    //         <p className="py-2">No object selected</p>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default SelectedObjectFramePagination;
