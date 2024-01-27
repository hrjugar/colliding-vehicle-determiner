import { useShallow } from "zustand/react/shallow";
import { getBoundingBoxColor } from "@renderer/globals/utils";
import useVehicleIdentificationPanelStore from "./store";
import { useLoaderData } from "react-router-dom";

const SelectedFrameObject: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [
    getSelectedObject,
    selectedFrame,
  ] = useVehicleIdentificationPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.selectedFrame,
      state.selectedObjectId
    ])
  )

  const selectedObject = getSelectedObject();
  const selectedFrameItem = selectedObject?.frames.find((frame) => frame.frame === selectedFrame);

  const getCroppedImageStyle = () => {
    if (!selectedFrameItem) return {};

    const top = selectedFrameItem.yn * 100 - selectedFrameItem.hn * 50;
    const right = 100 - (selectedFrameItem.xn * 100 + selectedFrameItem.wn * 50);
    const bottom = 100 - (selectedFrameItem.yn * 100 + selectedFrameItem.hn * 50);
    const left = selectedFrameItem.xn * 100 - selectedFrameItem.wn * 50;

    const widthScale = 1 / selectedFrameItem.wn;
    const heightScale = 1 / selectedFrameItem.hn;
    const translateXValue = 50 - (selectedFrameItem.xn * 100);
    const translateYValue = 50 - (selectedFrameItem.yn * 100);
    
    return {
      clipPath: `inset(
        ${top}%
        ${right}%
        ${bottom}%
        ${left}%
      )`,
      transform: `scale(${Math.min(widthScale, heightScale)}) translate(${translateXValue}%, ${translateYValue}%)`
    }
  }

  return (
    // Add your JSX code here
    <div className="card min-w-[12rem] flex flex-col">
      <div className="card-header">
        <h2>Frame Object</h2>
      </div>

      <div className="w-full flex flex-col flex-grow p-2 justify-start items-center gap-4">
        {selectedFrameItem ? (
          <>
            <div className="flex flex-col items-center w-full">
              <div className="relative flex items-center justify-center h-20 w-full ">
                <div className="absolute overflow-hidden">
                  <img 
                    src={`fileHandler://frame//${video.id}//${selectedFrame}`}
                    className="h-20"
                    style={ getCroppedImageStyle() }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-rows-2 grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">X</span> <span className="font-medium">{selectedFrameItem.x}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">Y</span> <span className="font-medium">{selectedFrameItem.y}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">W</span> <span className="font-medium">{selectedFrameItem.w}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">H</span> <span className="font-medium">{selectedFrameItem.h}</span></p>
            </div>
          </>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p>No frame selected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedFrameObject;