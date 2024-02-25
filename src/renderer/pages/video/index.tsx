import { getFileNameFromPath } from "@renderer/globals/utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import VideoPlayerSection from "./VideoPlayerSection";
import { Tab } from "@headlessui/react";
import React, { useEffect } from "react";
import VideoPanel from "./VideoPanel";
import useVideoPageStore from "./store";
import AccidentDetectionPanel from "./AccidentDetectionPanel";
import VehicleIdentificationPanel from "./VehicleIdentificationPanel";
import { Link } from "react-router-dom";
import OverallPanel from "./OverallPanel";
import useGlobalStore from "@/renderer/globals/store";

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

  const [setIsWindowButtonGroupColorLight] = useGlobalStore((state) => [state.setIsWindowButtonGroupColorLight]);

  useEffect(() => {
    resetStates();
    setIsWindowButtonGroupColorLight(false);
  }, []);

  return (
    <div className="page flex flex-col gap-4">
      <Tab.Group as={`div`} className={`w-full flex flex-row flex-grow overflow-y-auto`} selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
        <div className="flex flex-col justify-between py-4 bg-gradient-to-b from-color-primary to-[#040619]">
          <div className="no-drag flex flex-col items-start px-6 gap-1">
            
            <Link to=".." className="flex flex-row items-center gap-2 group-hover:font-medium text-white/50 hover:text-white transition-colors">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-2.5 h-2.5 cursor-pointer"
              >
                <path 
                  d="M48 0 L16 32 L48 64"
                  className="fill-none stroke-current stroke-[8] group-hover:stroke-[12]"
                />
              </svg>
              Back
            </Link>
            {/* <h1 className="text-2xl font-medium">Results - {getFileNameFromPath(video.path)}</h1> */}
          </div>          
          <Tab.List className="bg-red flex flex-col justify-center items-start gap-4 px-4">          
            {tabs.map((tab) => {
              return (
                <Tab 
                  key={`tab-${tab}`}
                  as={React.Fragment}
                >
                  {({ selected }) => (
                    <button className={`pl-4 pr-4 py-2 text-center flex justify-start items-center whitespace-nowrap w-full ${selected ? 'text-white bg-gradient-to-r from-color-primary to-[#445aff04]' : 'text-white/25 hover:text-white/75'} transition-all`}>
                      {tab}
                    </button>
                  )}
                </Tab>
              )
            })}
          </Tab.List>

          <div className="">&nbsp;</div>
        </div>

        <Tab.Panels className={`w-full flex-grow flex flex-col overflow-y-auto bg-slate-100`}>
          <h2 className="text-left text-2xl font-medium w-[calc(100%_-_128px)] px-8 p-4 draggable">{getFileNameFromPath(video.path)}</h2>
          <div className="w-full flex-grow flex flex-col overflow-y-auto">
            <OverallPanel />
            <VideoPanel />
            <AccidentDetectionPanel />
            <VehicleIdentificationPanel />
          </div>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default VideoPage;
