import VideoPlayer from "@/renderer/components/VideoPlayer";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

const VideoPanel: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [timePercentage, setTimePercentage] = useState(0);

  const playVideo = () => {
    setIsPaused(false);
  }

  const pauseVideo = () => {
    setIsPaused(true);
  }


  return (
    <Tab.Panel className="w-full h-full pb-4">
      <VideoPlayer
        videoSrc={`http://localhost:3000/video?source=app&id=${video.id}`}
        duration={duration}
        setDuration={setDuration}
        isPaused={isPaused}
        playVideo={playVideo}
        pauseVideo={pauseVideo}
        timePercentage={timePercentage}
        setTimePercentage={setTimePercentage}
        hasSeekbar={true}
        fps={video.fps}
      />
    </Tab.Panel>
  )
}

export default VideoPanel;