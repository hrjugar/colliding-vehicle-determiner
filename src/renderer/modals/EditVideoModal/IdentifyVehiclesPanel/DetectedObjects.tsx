import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";
import { capitalizeFirstLetter, getBoundingBoxColor } from "@renderer/globals/utils";
import { useRef } from "react";
import { Popover } from "@headlessui/react";
import useEditVideoModalStore from "../store";

const DetectedObjects: React.FC = () => {
  const [
    finalAccidentFrameVehicleOne,
    finalAccidentFrameVehicleTwo,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.finalAccidentFrameVehicleOne,
      state.finalAccidentFrameVehicleTwo,
    ])
  )

  const [
    deepSORTOutput,
    selectedObjectId,
    setSelectedObjectId,
    hiddenClassifications,
    getAllClassifications,
    getUnhiddenObjects,
    setClassificationVisibility,
    hideAllClassifications,
    unhideAllClassifications,
    unhideOnlyVehicleClassification
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.deepSORTOutput,
      state.selectedObjectId,
      state.setSelectedObjectId,
      state.shownClassifications,
      state.getAllClassifications,
      state.getShownObjects,
      state.setClassificationVisibility,
      state.hideAllClassifications,
      state.showAllClassifications,
      state.showOnlyVehicleClassification,
    ])
  )

  const unhiddenObjects = getUnhiddenObjects();
  const allClassifications = getAllClassifications();
  console.log(hiddenClassifications);

  return (
    <div className='card w-64 flex-grow min-h-0 flex flex-col'>
      <div className='card-header flex flex-row justify-between items-center'>
        <h2>Objects</h2>

        <Popover className="relative flex justify-center items-center ">
          <Popover.Button>
            <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 cursor-pointer rounded-full p-1 hover:bg-color-primary-active"
                onClick={() => {}}
              >
                <path 
                  d="M16 34.6667H48V29.3333H16M8 16V21.3333H56V16M26.6667 48H37.3333V42.6667H26.6667V48Z"
                  className="fill-current"
                />
              </svg>        
          </Popover.Button>

          <Popover.Panel className="card absolute top-[calc(100%_+_4px)] z-10 text-sm flex flex-col">
            <div className="flex flex-row justify-between gap-4 border-b-[1px] border-gray-300 px-4 py-2">
              <h2>Filters</h2>
              <Popover.Button>
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  className="p-1 w-5 h-5 rounded-full bg-transparent hover:bg-color-primary-active"
                >
                  <path 
                    d="M0 0 L64 64 M64 0 L0 64 Z"
                    className="fill-current stroke-[6] stroke-color-primary group-hover/edit-modal-close-btn:stroke-black"
                  />
                </svg>
              </Popover.Button>      
            </div>
            <div className="flex flex-col px-4 py-2 whitespace-nowrap gap-4">
              <div className="flex flex-row gap-4">
                <button onClick={unhideAllClassifications}>All</button>
                <button onClick={unhideOnlyVehicleClassification}>Vehicles Only</button>
                <button onClick={hideAllClassifications}>None</button>
              </div>

              <div className="flex flex-col">
                {Array.from(allClassifications).map((classification) => (
                  <div className="flex items-center gap-4 p-2 rounded hover:bg-gray-100" key={`classification-${classification}`}>
                    <input 
                      id={`obj-filter-${classification}`} 
                      type="checkbox" 
                      checked={hiddenClassifications.has(classification)}
                      onChange={(e) => setClassificationVisibility(classification, e.target.checked)}
                      className="w-4 h-4 text-color-primary accent-color-primary bg-gray-100 border-gray-300 rounded" 
                    />
                    <label 
                      htmlFor={`obj-filter-${classification}`} 
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                    >
                      {classification}
                    </label>
                  </div>           
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      <div className='flex-1 flex flex-col overflow-y-auto'>
        {unhiddenObjects.map((obj) => {
          return (
            <div 
              key={`detected-object-${obj.id}`}
              className={`flex flex-row items-center gap-2 px-4 py-0.5 cursor-pointer border-[2px] border-transparent ${selectedObjectId === obj.id ? 'bg-color-primary-active' : 'hover:border-color-primary-active'}`}
              onClick={() => setSelectedObjectId(obj.id)}
            >
              <div 
                className='w-3 h-3 border-[1px] border-gray-200' 
                style={{ backgroundColor: getBoundingBoxColor(obj.id) }} 
              />
              <p className="font-medium">{capitalizeFirstLetter(obj.classification)}</p>
              <span className='text-xs text-gray-500'>{obj.id}</span>
              {obj.id === finalAccidentFrameVehicleOne?.id || obj.id === finalAccidentFrameVehicleTwo?.id ? (
                <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg"
                className='w-4 h-4 text-yellow-500'
              >
                <path 
                  d="M32 46.0534L48.48 56L44.1066 37.2534L58.6666 24.64L39.4933 22.9867L32 5.33337L24.5066 22.9867L5.33331 24.64L19.8666 37.2534L15.52 56L32 46.0534Z"
                  className='fill-current'
                />
              </svg>                
              ) : null}              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectedObjects;
