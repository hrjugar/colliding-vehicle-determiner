import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "./store";
import { capitalizeFirstLetter, getBoundingBoxColor } from "@renderer/globals/utils";
import { useRef } from "react";
import { Popover } from "@headlessui/react";
import useEditVideoModalStore from "../store";
import { toast } from "react-toastify";
import { vehicleClassifications } from "./constants";

const DetectedObjects: React.FC = () => {
  const [
    bestAccidentFrameVehicleOne,
    bestAccidentFrameVehicleTwo,
    finalAccidentFrameVehicleOne,
    finalAccidentFrameVehicleTwo,
    setFinalAccidentFrameVehicleOne,
    setFinalAccidentFrameVehicleTwo,
    finalAccidentFrame,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.bestAccidentFrameVehicleOne,
      state.bestAccidentFrameVehicleTwo,
      state.finalAccidentFrameVehicleOne,
      state.finalAccidentFrameVehicleTwo,
      state.setFinalAccidentFrameVehicleOne,
      state.setFinalAccidentFrameVehicleTwo,
      state.finalAccidentFrame,
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
              className={`group flex flex-row items-center gap-2 px-4 py-0.5 cursor-pointer border-[2px] border-transparent ${selectedObjectId === obj.id ? 'bg-color-primary-active' : 'hover:border-color-primary-active'}`}
              onClick={() => setSelectedObjectId(obj.id)}
            >
              <div 
                className='w-3 h-3 border-[1px] border-gray-200' 
                style={{ backgroundColor: getBoundingBoxColor(obj.id) }} 
              />
              <p className="font-medium">{capitalizeFirstLetter(obj.classification)}</p>
              <span className='text-xs text-gray-500'>{obj.id}</span>
              {obj.frames.some((frame) => frame.frame === finalAccidentFrame) ? (
                <div title="Found During Accident">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className='w-4 h-4 text-gray-500'
                  >
                    <path 
                      d="M25.6267 42.96C25.6267 37.4134 28.24 32.5067 32.2667 29.3334H13.3333L17.3333 17.3334H46.6667L49.92 27.0934C52.16 28.08 54.1333 29.52 55.76 31.3067L50.4533 16C49.92 14.4534 48.4267 13.3334 46.6667 13.3334H17.3333C15.5733 13.3334 14.08 14.4534 13.5467 16L8 32V53.3334C8 54.8 9.2 56 10.6667 56H13.3333C14.8 56 16 54.8 16 53.3334V50.6667H27.44C26.2933 48.3467 25.6267 45.7334 25.6267 42.96ZM17.3333 42.6667C15.12 42.6667 13.3333 40.88 13.3333 38.6667C13.3333 36.4534 15.12 34.6667 17.3333 34.6667C19.5467 34.6667 21.3333 36.4534 21.3333 38.6667C21.3333 40.88 19.5467 42.6667 17.3333 42.6667ZM42.96 30.96C49.6267 30.96 54.96 36.2934 54.96 42.96C54.96 45.3334 54.2933 47.52 53.12 49.3334L61.3333 57.6267L57.6267 61.3334L49.3333 53.1467C47.4667 54.2934 45.3333 54.96 42.96 54.96C36.2933 54.96 30.96 49.6267 30.96 42.96C30.96 36.2934 36.2933 30.96 42.96 30.96ZM42.96 36.2934C41.6415 36.2934 40.3525 36.6844 39.2562 37.4169C38.1599 38.1495 37.3054 39.1906 36.8008 40.4088C36.2962 41.627 36.1642 42.9674 36.4214 44.2606C36.6787 45.5538 37.3136 46.7417 38.246 47.6741C39.1783 48.6064 40.3662 49.2414 41.6594 49.4986C42.9526 49.7558 44.2931 49.6238 45.5112 49.1192C46.7294 48.6147 47.7706 47.7602 48.5031 46.6638C49.2357 45.5675 49.6267 44.2786 49.6267 42.96C49.6267 39.2534 46.6667 36.2934 42.96 36.2934Z"
                      className='fill-current'
                    />
                  </svg>   
                </div>   
              ): null}
              {obj.id === bestAccidentFrameVehicleOne?.id || obj.id === bestAccidentFrameVehicleTwo?.id ? (
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
              {obj.id === finalAccidentFrameVehicleOne?.id || obj.id === finalAccidentFrameVehicleTwo?.id ? (
                <div title="Selected">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className='w-4 h-4 text-color-primary'
                  >
                    <path 
                      d="M26.6667 45.3334L13.3333 32L17.0933 28.2134L26.6667 37.7867L46.9067 17.5467L50.6667 21.3334M32 5.33337C28.4981 5.33337 25.0305 6.02313 21.7951 7.36325C18.5598 8.70338 15.6201 10.6676 13.1438 13.1439C8.14286 18.1448 5.33334 24.9276 5.33334 32C5.33334 39.0725 8.14286 45.8553 13.1438 50.8562C15.6201 53.3325 18.5598 55.2967 21.7951 56.6368C25.0305 57.977 28.4981 58.6667 32 58.6667C39.0725 58.6667 45.8552 55.8572 50.8562 50.8562C55.8572 45.8553 58.6667 39.0725 58.6667 32C58.6667 28.4981 57.9769 25.0305 56.6368 21.7951C55.2967 18.5598 53.3324 15.6201 50.8562 13.1439C48.38 10.6676 45.4403 8.70338 42.2049 7.36325C38.9696 6.02313 35.5019 5.33337 32 5.33337Z"
                      className='fill-current'
                    />
                  </svg>         
                </div>       
              ) : null}

              {vehicleClassifications.includes(obj.classification) && 
              finalAccidentFrame !== undefined && finalAccidentFrame !== null &&
              obj.frames.some((frame) => frame.frame === finalAccidentFrame) ? (
                <button 
                  className="hidden group-hover:block ml-auto bg-transparent text-color-primary font-semibold text-xs opacity-60 hover:opacity-100"
                  onClick={() => {
                    if (obj.id === finalAccidentFrameVehicleOne?.id) {
                      setFinalAccidentFrameVehicleOne(undefined);
                    } else if (obj.id === finalAccidentFrameVehicleTwo?.id) {
                      setFinalAccidentFrameVehicleTwo(undefined);
                    } else {
                      if (finalAccidentFrameVehicleOne && finalAccidentFrameVehicleTwo) {
                        toast.error('There are already two vehicles selected as the involved accident. Please deselect one of them first.')
                      } else {
                        const accidentFrameVehicleCoordinates = obj.frames[finalAccidentFrame - 1]

                        if (finalAccidentFrameVehicleOne === undefined) {
                          setFinalAccidentFrameVehicleOne({ id: obj.id, ...accidentFrameVehicleCoordinates });
                        } else if (finalAccidentFrameVehicleTwo === undefined) {
                          setFinalAccidentFrameVehicleTwo({ id: obj.id, ...accidentFrameVehicleCoordinates })
                        }
                      }
                    }
                  }}
                >
                  {obj.id === finalAccidentFrameVehicleOne?.id || obj.id === finalAccidentFrameVehicleTwo?.id ? 'Deselect' : 'Select'}
                </button>
              ) : null}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectedObjects;
