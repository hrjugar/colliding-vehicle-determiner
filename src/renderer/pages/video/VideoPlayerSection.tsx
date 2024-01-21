import VideoPlayer from "@renderer/components/VideoPlayer"
import { useState } from "react";

interface VideoPlayerSectionProps {
  id: number | bigint;
  fps: number;
}

const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({ id, fps }) => {
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [timePercentage, setTimePercentage] = useState(0);
  
  return (
    <section className="w-full max-h-[50vh]">
      <VideoPlayer
        videoSrc={`http://localhost:3000/video?source=app&id=${id}`}
        duration={duration}
        setDuration={setDuration}
        isPaused={isPaused}
        playVideo={() => setIsPaused(false)}
        pauseVideo={() => setIsPaused(true)}
        timePercentage={timePercentage}
        setTimePercentage={setTimePercentage}
        hasSeekbar={true}
        fps={fps}
      />
    </section>
  )
}

export default VideoPlayerSection;