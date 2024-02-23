import { getFileNameFromPath } from "@renderer/globals/utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import VideoPlayerSection from "./VideoPlayerSection";
import FrameSection from "./OverallPanel/FrameSection";
import { Tab } from "@headlessui/react";
import React, { useEffect } from "react";
import OverallPanel from "./OverallPanel";
import VideoPanel from "./VideoPanel";
import useVideoPageStore from "./store";
import { useShallow } from "zustand/react/shallow";
import AccidentDetectionPanel from "./AccidentDetectionPanel";
import VehicleIdentificationPanel from "./VehicleIdentificationPanel";

const tabs = ["Overall", "Video", "Accident Detection", "Vehicle Identification"]

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const video = useLoaderData() as VideoData;
  console.log(video);
  
  const [
    selectedTabIndex,
    setSelectedTabIndex,
    resetStates,
  ] = useVideoPageStore(
    (state) => [
      state.selectedTabIndex,
      state.setSelectedTabIndex,
      state.resetStates
    ]
  )

  useEffect(() => {
    resetStates();
  }, []);

  return (
    <div className="page pt-4 flex flex-col gap-4">
      <div className="no-drag flex flex-col items-start px-6 gap-1">
        <div 
          className="group text-sm flex flex-row items-center gap-2 cursor-pointer"
          onClick={() => navigate("..")}
        >
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-2.5 h-2.5 cursor-pointer"
            >
              <path 
                d="M48 0 L16 32 L48 64"
                className="fill-none stroke-color-primary stroke-[8] group-hover:stroke-[12] transition-all"
              />
            </svg>
            <p className="group-hover:font-medium">Back</p>
        </div>
        <h1 className="text-2xl font-medium">Results - {getFileNameFromPath(video.path)}</h1>
      </div>

      <Tab.Group as={`div`} className={`flex flex-col w-full flex-grow overflow-y-auto`} selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
        <Tab.List className="bg-red flex flex-row items-center border-b-[1px] border-gray-300 w-full justify-start gap-4 px-4">
          {tabs.map((tab) => {
            return (
              <Tab 
                key={`tab-${tab}`}
                as={React.Fragment}
              >
                {({ selected }) => (
                  <button className={`px-2 pb-2 bg-transparent border-b-2 ${selected ? 'border-color-primary font-semibold text-color-primary' : 'border-transparent hover:border-gray-400'}`}>
                    {tab}
                  </button>
                )}
              </Tab>
            )
          })}
        </Tab.List>

        <Tab.Panels className={`w-full flex-grow p-4 overflow-y-auto bg-slate-100`}>
          <OverallPanel />
          <VideoPanel />
          <AccidentDetectionPanel />
          <VehicleIdentificationPanel />
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default VideoPage;
