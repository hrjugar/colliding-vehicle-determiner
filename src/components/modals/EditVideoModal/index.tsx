import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import TrimVideoPanel from "./TrimVideoPanel";
import DetectAccidentPanel from "./DetectAccidentPanel";
import IdentifyVehiclesPanel from "./IdentifyVehiclesPanel";

const tabs = [
  {
    title: 'Trim Video'
  },
  {
    title: 'Detect Accident'
  },
  {
    title: 'Identify Vehicles'
  }
]

interface EditVideoModalProps {
  videoPath: string,
  isOpen: boolean,
  close: any,
  selectedTabIndex: number,
  setSelectedTabIndex: (index: number) => void,
  areTabsDisabled: boolean,
  setAreTabsDisabled: (disabled: boolean) => void
}

export interface VideoMetadata {
  isInitiallyLoading: boolean,
  duration: number,
  paused: boolean
}

export type SliderMarkerType = "start" | "time" | "end";

export interface SliderMarkersState {
  start: number;
  time: number;
  end: number;
}

export type SliderMarkersAction = (
  { type: 'SET'; payload: SliderMarkersState} |
  { type: 'SET_START'; payload: number } | 
  { type: 'SET_TIME'; payload: number } | 
  { type: 'SET_END'; payload: number } |
  { type: 'SET_DYNAMIC'; payload: { type: SliderMarkerType, value: number } }
);

const sliderMarkersReducer = (
  state: SliderMarkersState,
  action: SliderMarkersAction
): SliderMarkersState => {
  switch (action.type) {
    case 'SET':
      return { ...action.payload };
    case 'SET_START':
      return { ...state, start: action.payload };
    case 'SET_TIME':
      return { ...state, time: action.payload };
    case 'SET_END':
      return { ...state, end: action.payload };
    case 'SET_DYNAMIC':
      return { ...state, [action.payload.type]: action.payload.value };
    default:
      return state;
  }
};

const EditVideoModal: React.FC<EditVideoModalProps> = ({ 
  videoPath, 
  isOpen, 
  close, 
  selectedTabIndex, 
  setSelectedTabIndex,
  areTabsDisabled,
  setAreTabsDisabled
}) => {
  // EDIT VIDEO MODAL STATES -----------------------------------------------
  const [tabDimensions, setTabDimensions] = useState({width: 0, left: 0});
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [isFirstTabRendered, setIsFirstTabRendered] = useState<boolean>(false);

  useEffect(() => {
    function setTabPosition() {
      const selectedTab = tabsRef.current[selectedTabIndex];
      setTabDimensions({
        width: selectedTab?.clientWidth || 0,
        left: selectedTab?.offsetLeft || 0,
      });
    }

    setTabPosition();
    window.addEventListener('resize', setTabPosition);
    return () => window.removeEventListener('resize', setTabPosition);
  }, [selectedTabIndex, isFirstTabRendered]);

  // TRIM VIDEO PANEL STATES -----------------------------------------------
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    isInitiallyLoading: true,
    duration: 0,
    paused: true
  });
  
  const [sliderMarkers, sliderMarkersDispatch] = useReducer(sliderMarkersReducer, {
    start: 0,
    time: 0,
    end: 0
  });

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog onClose={() => close()}>
        <div className="fixed inset-0 w-screen h-full flex flex-col items-center justify-end">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" onClick={() => close()} />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition linear duration-500 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition linear duration-500 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"          
          >
            <Dialog.Panel className='w-full h-[calc(100vh_-_2.75rem)] flex flex-col bg-white rounded-t-2xl'>
              <Tab.Group as={Fragment} selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
                <div className="w-full flex flex-row items-start justify-between px-6 py-4 border-b-[1px] border-gray-300 gap-2">
                  {/* <div className="flex-1"/> */}
                  <Tab.List className='relative flex flex-row items-center gap-8'>
                    {tabs.map((tab, i) => {
                      const isTabInRange = i - selectedTabIndex < 2
                      const isTabDisabled = areTabsDisabled || !isTabInRange
                      return (
                        <Tab 
                          key={`edit-modal-tab-${i}`}
                          disabled={isTabDisabled}
                          className={`z-[2] p-0`}
                          ref={(el) => {
                            tabsRef.current[i] = el
                            if (i === 0) {
                              setIsFirstTabRendered(true);
                            }
                          }}
                        >
                          {({ selected }) => (
                            <div 
                              className={`group flex-grow flex flex-row items-center gap-2 text-sm ${isTabDisabled ? 'opacity-25 pointer-events-none' : ''}`}
                            >
                              <span 
                                className={`px-3 py-1.5 rounded-full border-2 font-bold ${
                                  selected ? 'border-color-primary bg-color-primary text-white' : 'border-gray-500 text-gray-500 group-hover:border-color-primary group-hover:text-color-primary'
                                }`}
                              >{i + 1}</span>
                              <p className={`font-semibold ${selected ? 'text-color-primary' : 'text-gray-500 group-hover:text-color-primary'}`}>{tab.title}</p>
                            </div>
                          )}
                        </Tab>
                      )
                    })}
                  </Tab.List>
                  <button 
                    className="group/edit-modal-close-btn p-2 rounded-full bg-transparent hover:bg-color-primary-active"
                    onClick={() => close()}
                  >
                    <svg 
                      width="64" 
                      height="64" 
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-transparent"
                    >
                      <path 
                        d="M0 0 L64 64 M64 0 L0 64 Z"
                        className="fill-current stroke-[6] stroke-color-primary group-hover/edit-modal-close-btn:stroke-black"
                      />
                    </svg>
                  </button>
                </div>
                
                <Tab.Panels className='bg-white w-full h-full overflow-hidden'>
                  {tabs.map((_, i) => {
                    if (i === 0) {
                      return (
                        <TrimVideoPanel
                          key={'edit-modal-tab-panel-0'}
                          videoPath={videoPath} 
                          videoMetadata={videoMetadata}
                          setVideoMetadata={setVideoMetadata}
                          sliderMarkers={sliderMarkers}
                          sliderMarkersDispatch={sliderMarkersDispatch}
                          selectedTabIndex={selectedTabIndex}
                        />
                      )
                    } else if (i === 1) {
                      return (
                        <DetectAccidentPanel 
                          key={'edit-modal-tab-panel-1'} 
                          selectedTabIndex={selectedTabIndex} 
                          setAreTabsDisabled={setAreTabsDisabled}
                          videoPath={videoPath}
                          startTime={sliderMarkers.start}
                          endTime={sliderMarkers.end}
                        />
                      )
                    } else if (i === 2) {
                      return (
                        <IdentifyVehiclesPanel 
                          key={'edit-modal-tab-panel-2'}
                          selectedTabIndex={selectedTabIndex}
                        />
                      )
                    }
                  })}
                </Tab.Panels>

                <div className="flex flex-row justify-center gap-2">
                  {selectedTabIndex === 0 ? (
                    <button
                      className={`bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300`}
                      disabled={areTabsDisabled}
                      onClick={() => close()}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button 
                      className={`bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300`}
                      disabled={areTabsDisabled}
                      onClick={() => setSelectedTabIndex(selectedTabIndex - 1)}
                    >
                      Previous
                    </button>
                  )}
                  {selectedTabIndex === tabs.length - 1 ? (
                    <button
                      className="bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300"
                      onClick={() => close()}
                      disabled={areTabsDisabled}
                    >
                      Finish
                    </button>
                  ) : (
                    <button 
                      className="bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300"
                      disabled={selectedTabIndex === tabs.length - 1 || areTabsDisabled}
                      onClick={() => setSelectedTabIndex(selectedTabIndex + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </Tab.Group>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditVideoModal;