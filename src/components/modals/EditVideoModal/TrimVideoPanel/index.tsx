import { Tab } from "@headlessui/react"
import { useEffect, useRef } from "react";
import TrimTimeInput from "./TrimTimeInput";
import VideoTrimmingSlider from "./VideoTrimmingSlider";
import useEditVideoModalStore from "@/stores/useEditVideoModalStore";
import { useShallow } from "zustand/react/shallow";

const TrimVideoPanel: React.FC = () => {
  const [
    videoPath, 
    selectedTabIndex, 
    sliderMarkers,
    setSliderMarkers,
    setTimeMarker,
    videoMetadata,
    finishInitialVideoLoading,
    playVideo,
    pauseVideo
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoPath,
      state.selectedTabIndex,
      state.sliderMarkers,
      state.setSliderMarkers,
      state.setTimeMarker,
      state.videoMetadata,
      state.finishInitialVideoLoading,
      state.playVideo,
      state.pauseVideo
    ])
  )
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoSkip = (isBackwards : boolean) => {
    if (videoRef.current) {
      videoRef.current.currentTime = isBackwards ? sliderMarkers.start : sliderMarkers.end;
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        playVideo();
      } else {
        videoRef.current.pause();
        pauseVideo();
      }
    }
  }

  const updateVideoFromTimeHandle = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }

  const handleInitialLoading = () => {
    console.log("handleInitialLoading: here")

    if (videoRef.current && videoRef.current.readyState >= 3 && videoMetadata.isInitiallyLoading) {
      const duration = videoRef.current!.duration
      console.log(`duration: ${duration}`)
      finishInitialVideoLoading(duration)
      setSliderMarkers({
        start: 0,
        time: 0,
        end: duration
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime

      if (currentTime > sliderMarkers.end) {
        videoRef.current.currentTime = sliderMarkers.start;
        videoRef.current.pause();
        pauseVideo();
      }

      setTimeMarker(currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = sliderMarkers.start;
      videoRef.current.pause();
      pauseVideo();
    }
  }

  // useEffect(() => {
  //   setVideoMetadata((prevState) => ({...prevState, isInitiallyLoading: true, paused: true, duration: 0}));
  // }, [videoPath]);

  useEffect(() => {
    if (selectedTabIndex === 0 && videoRef.current) {
      videoRef.current.pause();
      pauseVideo();
      videoRef.current.currentTime = sliderMarkers.time;
    }
  }, [selectedTabIndex, videoRef.current])

  return (
    <Tab.Panel className='w-full h-full flex flex-col justify-start items-center gap-2 p-4'>
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
        <video
          className="max-w-full max-h-full flex object-scale-down aspect-video"
          muted
          ref={videoRef}
          onLoadedData={handleInitialLoading}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
        >
          <source 
            src={`http://localhost:3000/video?path=${videoPath}`} 
            type="video/mp4" 
          />
        </video>
        
      </div>

      {videoMetadata.isInitiallyLoading ? null : (
        <div className="w-full flex flex-col justify-center items-center pb-4 gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex-1 flex flex-row justify-start items-center">
              <TrimTimeInput 
                label={"Start"}
                sliderMarkerType="start"
              />
            </div>

            <div className="flex-1 flex justify-center items-center gap-1">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-8 h-8 text-color-primary cursor-pointer"
                onClick={() => handleVideoSkip(true)}
              >
                <path 
                  d="M53.3333 13.3334V50.6667L34.6667 32M16 13.3334V50.6667H10.6667V13.3334M34.6667 13.3334V50.6667L16 32"
                  className="fill-current"
                />
              </svg>

              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-12 h-12 text-color-primary cursor-pointer"
                onClick={() => handlePlayPause()}
              >
                <path 
                  d={videoMetadata.paused ? (
                    "M21.3333 13.7067V51.04L50.6667 32.3733L21.3333 13.7067Z"
                  ): (
                    "M37.3333 50.6667H48V13.3334H37.3333M16 50.6667H26.6667V13.3334H16V50.6667Z"
                  )}
                  className="fill-current"
                />
              </svg>

              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-8 h-8 text-color-primary cursor-pointer"
                onClick={() => handleVideoSkip(false)}
              >
                <path 
                  d="M10.6667 13.3334V50.6667L29.3333 32M48 13.3334V50.6667H53.3333V13.3334M29.3333 13.3334V50.6667L48 32"
                  className="fill-current"
                />
              </svg>

            </div>

            <div className="flex-1 flex flex-row justify-end items-center">
              <TrimTimeInput 
                label={"End"}
                sliderMarkerType="end"
              />
            </div>
          </div>
          
          <VideoTrimmingSlider 
            updateVideoFromTimeHandle={updateVideoFromTimeHandle}
          />
        </div>
      )}

    </Tab.Panel>
  )
}

export default TrimVideoPanel;