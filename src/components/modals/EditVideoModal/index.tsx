import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import TrimVideoPanel from "./TrimVideoPanel";
import DetectAccidentPanel from "./DetectAccidentPanel";
import IdentifyVehiclesPanel from "./IdentifyVehiclesPanel";
import useEditVideoModalStore from "@/store/useEditVideoModalStore";
import { useShallow } from "zustand/react/shallow";

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

export interface VideoMetadata {
  isInitiallyLoading: boolean,
  duration: number,
  paused: boolean
}

const EditVideoModal: React.FC = () => {
  const [
    isOpen, 
    selectedTabIndex, 
    areTabsDisabled, 
    closeModal, 
    selectTab
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.isOpen, 
      state.selectedTabIndex, 
      state.areTabsDisabled, 
      state.closeModal, 
      state.selectTab
    ])
  );

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog onClose={closeModal}>
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
            <Dialog.Overlay className="fixed inset-0 bg-black/30" onClick={closeModal} />
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
              <Tab.Group as={Fragment} selectedIndex={selectedTabIndex} onChange={selectTab}>
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
                    onClick={closeModal}
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
                        />
                      )
                    } else if (i === 1) {
                      return (
                        <DetectAccidentPanel 
                          key={'edit-modal-tab-panel-1'} 
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

                <div className="flex flex-row justify-center gap-2 py-1 border-[1px] border-gray-300">
                  {selectedTabIndex === 0 ? (
                    <button
                      className={`bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300`}
                      disabled={areTabsDisabled}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button 
                      className={`bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300`}
                      disabled={areTabsDisabled}
                      onClick={() => selectTab(selectedTabIndex - 1)}
                    >
                      Previous
                    </button>
                  )}
                  {selectedTabIndex === tabs.length - 1 ? (
                    <button
                      className="bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300"
                      onClick={closeModal}
                      disabled={areTabsDisabled}
                    >
                      Finish
                    </button>
                  ) : (
                    <button 
                      className="bg-transparent px-4 py-2 text-color-primary disabled:text-gray-300"
                      disabled={selectedTabIndex === tabs.length - 1 || areTabsDisabled}
                      onClick={() => selectTab(selectedTabIndex + 1)}
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