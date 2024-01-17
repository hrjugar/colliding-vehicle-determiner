import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";
import { capitalizeFirstLetter, getBoundingBoxColor } from "@/globals/utils";
import { useRef } from "react";
import { useOutsideAlerter } from "@/globals/hooks";

const DetectedObjects: React.FC = () => {
  const [
    deepSORTOutput,
    selectedObjectIndex,
    setSelectedObjectIndex,
    shouldShowOnlyVehicles,
    setShouldShowOnlyVehicles
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.deepSORTOutput,
      state.selectedObjectIndex,
      state.setSelectedObjectIndex,
      state.shouldShowOnlyVehicles,
      state.setShouldShowOnlyVehicles
    ])
  )
  
  const objectListRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(objectListRef, () => {
    setSelectedObjectIndex(-1);
  });

  return (
    <div className='card h-full w-64'>
      <div className='card-header flex flex-row justify-between items-center'>
        <h2>Objects</h2>
        {/* <label className="relative inline-flex items-center cursor-pointer whitespace-nowrap select-none">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={shouldShowOnlyVehicles}
              onChange={(e) => setShouldShowOnlyVehicles(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-color-primary"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show only vehicles</span>
          </label>     */}
      </div>

      <div className='flex flex-col' ref={objectListRef}>
        {deepSORTOutput.map((object, index) => {
          if (shouldShowOnlyVehicles && object.classification !== 'car' && object.classification !== 'truck') {
            return null;
          }
          
          return (
            <div 
              key={`detected-object-${index}`}
              className={`flex flex-row items-center gap-2 px-4 py-0.5 cursor-pointer border-[2px] border-transparent ${selectedObjectIndex === index ? 'bg-color-primary-active' : 'hover:border-color-primary-active'}`}
              onClick={() => setSelectedObjectIndex(index)}
            >
              <div 
                className='w-3 h-3 border-[1px] border-gray-200' 
                style={{ backgroundColor: getBoundingBoxColor(object.id) }} 
              />
              <p className="font-medium">{capitalizeFirstLetter(object.classification)}</p>
              <span className='text-xs text-gray-500'>{object.id}</span>              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectedObjects;
