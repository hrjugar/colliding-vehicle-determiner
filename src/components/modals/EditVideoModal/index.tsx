import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import TrimVideoPanel from "./TrimVideoPanel";
import IdentifyVehiclesPanel from "./IdentifyVehiclesPanel";

const tabs = [
  {
    title: 'Trim Video'
  },
  {
    title: 'Identify Vehicles'
  }
]

interface EditVideoModalProps {
  videoPath: string,
  isOpen: boolean,
  close: any,
}

export interface VideoMetadata {
  isInitiallyLoading: boolean,
  duration: number,
  paused: boolean
}


const EditVideoModal: React.FC<EditVideoModalProps> = ({ videoPath, isOpen, close }) => {
  // EDIT VIDEO MODAL STATES -----------------------------------------------
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [tabDimensions, setTabDimensions] = useState({width: 0, left: 0});
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [isFirstTabRendered, setIsFirstTabRendered] = useState<boolean>(false);
  const [areTabsDisabled, setAreTabsDisabled] = useState<boolean>(false);

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
  const [sliderHandleValues, setSliderHandleValues] = useState<number[]>([0, 0, 0]);
  const sliderHandleValuesRef = useRef(sliderHandleValues);

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
            <Dialog.Panel className='w-full h-[calc(100vh_-_2rem)] flex flex-col bg-white rounded-t-2xl p-2 gap-2'>
              <Tab.Group as={Fragment} selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
                <div className="w-full flex flex-row items-start justify-between px-4 py-2">
                  <Tab.List className='relative flex flex-row items-center gap-4'>
                    {tabs.map((tab, i) => {
                      return (
                        <Tab 
                          key={`edit-modal-tab-${i}`}
                          disabled={areTabsDisabled}
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
                              className={`flex-grow flex flex-col items-start gap-0 px-4 py-2 rounded-lg ${selected ? 'text-white' : areTabsDisabled ? 'text-gray-300' : 'hover:bg-color-primary-active text-color-primary'}`}

                            >
                              <span className={`text-xs`}>Step {i + 1}</span>
                              <p>{tab.title}</p>
                            </div>
                          )}
                        </Tab>
                      )
                    })}
                    <div 
                      className="absolute z-[1] h-14 bg-color-primary rounded-lg transition-all duration-300"
                      style={{ left: tabDimensions.left, width: tabDimensions.width }}
                    ></div>
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
                
                <Tab.Panels className='bg-white w-full h-full px-4 overflow-hidden'>
                  {tabs.map((_, i) => {
                    if (i === 0) {
                      return (
                        <TrimVideoPanel
                          key={'edit-modal-tab-panel-0'}
                          videoPath={videoPath} 
                          videoMetadata={videoMetadata}
                          setVideoMetadata={setVideoMetadata}
                          sliderHandleValues={sliderHandleValues}
                          setSliderHandleValues={setSliderHandleValues}
                          sliderHandleValuesRef={sliderHandleValuesRef}
                          selectedTabIndex={selectedTabIndex}
                        />
                      )
                    } else if (i === 1) {
                      return (
                        <IdentifyVehiclesPanel 
                          key={'edit-modal-tab-panel-1'} 
                          selectedTabIndex={selectedTabIndex} 
                          setAreTabsDisabled={setAreTabsDisabled}
                          videoPath={videoPath}
                          startTime={sliderHandleValues[0]}
                          endTime={sliderHandleValues[2]}
                        />
                      )
                    }
                  })}
                </Tab.Panels>

                <div className="flex flex-row justify-center gap-2 ">
                  <button 
                    className={`bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300`}
                    disabled={selectedTabIndex === 0 || areTabsDisabled}
                    onClick={() => setSelectedTabIndex(selectedTabIndex - 1)}
                  >
                    Previous
                  </button>
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