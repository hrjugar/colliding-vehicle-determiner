import { Tab } from "@headlessui/react"
import FrameSection from "./FrameSection";
import { useLoaderData } from "react-router-dom";

const OverallPanel: React.FC = () => {
  const video = useLoaderData() as VideoData;

  return (
    <Tab.Panel className={`flex flex-col gap-4`}>
      {video.accidentFrame ? (
        <>
          <FrameSection />
        </>
      ) : (
        <h2 className="text-2xl text-left">Video has no accident frames.</h2>
      )}

    </Tab.Panel>
  )
}

export default OverallPanel;