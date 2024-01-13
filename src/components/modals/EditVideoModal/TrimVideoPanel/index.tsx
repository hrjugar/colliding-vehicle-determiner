import { Tab } from "@headlessui/react"
import { useEffect, useRef } from "react";
import TrimTimeInput from "./TrimTimeInput";
import VideoTrimmingSlider from "./VideoTrimmingSlider";
import useEditVideoModalStore from "../store";
import { useShallow } from "zustand/react/shallow";

const TrimVideoPanel: React.FC = () => {
  const [
    videoPath, 
    selectedTabIndex, 
    sliderMarkers,
    setSliderMarkers,
    setTimeMarker,
    isVideoInitiallyLoading,
    isPaused,
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
      state.isVideoInitiallyLoading,
      state.isPaused,
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

    if (videoRef.current && videoRef.current.readyState >= 3 && isVideoInitiallyLoading) {
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
      <div className="group relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
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
        
        <div className={`opacity-0 group-hover:opacity-100 absolute flex justify-center items-center gap-8 text-white transition-opacity`}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-12 h-12 bg-black/50 rounded-full p-2 cursor-pointer"
            onClick={() => handleVideoSkip(true)}
          >
            <path 
              d="M16 48V16H21.3333V48H16ZM25.3333 32L48 16V48L25.3333 32Z"
              className="fill-current"
            />
          </svg>

          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-24 h-24 bg-black/50 rounded-full p-4 cursor-pointer"
            onClick={() => handlePlayPause()}
          >
            <path 
              d={isPaused ? (
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
            className="w-12 h-12 bg-black/50 rounded-full p-2 cursor-pointer"
            onClick={() => handleVideoSkip(false)}
          >
            <path 
              d="M42.6667 48H48V16H42.6667M16 48L38.6667 32L16 16V48Z"
              className="fill-current"
            />
          </svg>
        </div>        
      </div>

      {isVideoInitiallyLoading ? null : (
        <div className="w-full flex flex-col justify-center items-center pb-4 gap-4">
          <div className="w-full flex justify-between items-center">
            <TrimTimeInput 
              label={"Start"}
              sliderMarkerType="start"
            />

            <TrimTimeInput 
              label={"End"}
              sliderMarkerType="end"
            />
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