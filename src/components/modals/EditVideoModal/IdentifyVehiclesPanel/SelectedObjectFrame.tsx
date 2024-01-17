import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";

interface SelectedObjectFrameProps {
  // Add any props you need for the component
}

const SelectedObjectFrame: React.FC<SelectedObjectFrameProps> = () => {
  const [
    getSelectedObject,
    selectedFrame,
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.selectedFrame,
      state.selectedObjectId
    ])
  )

  const selectedObject = getSelectedObject();
  const selectedFrameItem = selectedObject?.frames.find((frame) => frame.frame === selectedFrame);

  return (
    // Add your JSX code here
    <div className="card min-w-[12rem] flex flex-col">
      <div className="card-header">
        <h2>Frame Object</h2>
      </div>

      <div className="w-full flex flex-col flex-grow p-2 justify-start items-center gap-2">
        {selectedFrameItem ? (
          <>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center h-20 w-full">
                <img src={`fileHandler://tempFrame//${selectedFrame}`} className="object-contain h-20"/>
              </div>
              <p className="text-xs text-center">Frame {selectedFrame}</p>
            </div>

            <div className="grid grid-rows-2 grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">X</span> <span className="font-medium">{selectedFrameItem.x}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">Y</span> <span className="font-medium">{selectedFrameItem.y}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">W</span> <span className="font-medium">{selectedFrameItem.w}</span></p>
              <p className="flex flex-row items-center gap-2"><span className="text-gray-400">H</span> <span className="font-medium">{selectedFrameItem.h}</span></p>
            </div>
          </>
        ) : (
          <p>No frame selected.</p>
        )}
      </div>
      {/* Add your component content here */}
    </div>
  );
};

export default SelectedObjectFrame;
