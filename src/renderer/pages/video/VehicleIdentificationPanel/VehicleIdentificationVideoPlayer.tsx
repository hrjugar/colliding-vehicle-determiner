import VideoPlayer from "@/renderer/components/VideoPlayer";
import { useLoaderData } from "react-router-dom";
import useVehicleIdentificationPanelStore from "./store";
import { useShallow } from "zustand/react/shallow";
import { getBoundingBoxColor } from "@/renderer/globals/utils";

const VehicleIdentificationVideoPlayer: React.FC = () => {
  const video = useLoaderData() as VideoData;
  
  const [
    duration,
    setDuration,
    isPaused,
    playVideo,
    pauseVideo,
    timePercentage,
    setTimePercentage,
    selectedFrame,
    getSelectedObject,
  ] = useVehicleIdentificationPanelStore(
    useShallow((state) => [
      state.duration,
      state.setDuration,
      state.isPaused,
      state.playVideo,
      state.pauseVideo,
      state.timePercentage,
      state.setTimePercentage,
      state.selectedFrame,
      state.getSelectedObject,
      state.selectedObjectId,
    ])
  );

  const selectedObject = getSelectedObject();

  const getSelectedObjectSeekBarAreas = () => {
    if (selectedObject && duration > 0) {
      const frameGroupList: number[][] = [];
      let currentFrameGroup: number[] = [];

      selectedObject.frames.forEach((frame, index) => {
        if (index === 0 || frame.frame === selectedObject.frames[index - 1].frame + 1) {
          currentFrameGroup.push(frame.frame);
        } else {
          frameGroupList.push([currentFrameGroup[0], currentFrameGroup[currentFrameGroup.length - 1]]);
          currentFrameGroup = [frame.frame];
        }
      })

      if (currentFrameGroup.length > 0) {
        frameGroupList.push([currentFrameGroup[0], currentFrameGroup[currentFrameGroup.length - 1]]);
      }

      const selectedObjectSeekBarAreas = [];
      for (const frameGroup of frameGroupList) {
        const startPercentage = ((frameGroup[0] - 1) / (duration * video.fps)) * 100;
        const endPercentage = (frameGroup[frameGroup.length - 1] / (duration * video.fps)) * 100;
        const widthPercentage = endPercentage - startPercentage;

        selectedObjectSeekBarAreas.push(
          <div 
            key={`selected-object-seek-bar-area-${frameGroup[0]}`} 
            className='absolute h-full min-w-[1px]'
            style={{ left: `${startPercentage}%`, width: `${widthPercentage}%`, backgroundColor: getBoundingBoxColor(selectedObject.id) }}
          />
        )
      }

      return selectedObjectSeekBarAreas;
    }

    return null;
  }  

  return (
    <VideoPlayer 
      videoSrc={`http://localhost:3000/video?source=app&id=${video.id}&pred=true`}
      duration={duration}
      setDuration={setDuration}
      isPaused={isPaused}
      playVideo={playVideo}
      pauseVideo={pauseVideo}
      timePercentage={timePercentage}
      setTimePercentage={setTimePercentage}
      hasSeekbar={true}
      markSeekbarAreas={getSelectedObjectSeekBarAreas}
      fps={video.fps}
      dependency={selectedFrame}
      dependencyFunction={(videoRef: React.RefObject<HTMLVideoElement>) => {
        if (selectedFrame === -1) return;

        if (videoRef && videoRef.current) {
          const frameTime = (selectedFrame - 0.999) / video.fps;
          videoRef.current.currentTime = frameTime;
        }
      }}
    />
  )
}

export default VehicleIdentificationVideoPlayer;