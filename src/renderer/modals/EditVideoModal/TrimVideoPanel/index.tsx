import { Tab } from "@headlessui/react"
import { useEffect, useRef } from "react";
import TrimTimeInput from "./TrimTimeInput";
import VideoTrimmingSlider from "./VideoTrimmingSlider";
import useEditVideoModalStore from "../store";
import { useShallow } from "zustand/react/shallow";
import { convertSecondsAndMillisecondsToString } from "@renderer/globals/utils";

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

            <div className="flex-1">
            </div>

            <p className="flex-1 flex flex-row justify-center items-end font-semibold text-lg gap-2">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-8 h-8"
              >
                <path 
                  d="M32 53.3333C27.0493 53.3333 22.3014 51.3666 18.8007 47.866C15.3 44.3653 13.3333 39.6173 13.3333 34.6666C13.3333 29.7159 15.3 24.968 18.8007 21.4673C22.3014 17.9666 27.0493 16 32 16C36.9507 16 41.6986 17.9666 45.1993 21.4673C48.7 24.968 50.6667 29.7159 50.6667 34.6666C50.6667 39.6173 48.7 44.3653 45.1993 47.866C41.6986 51.3666 36.9507 53.3333 32 53.3333ZM50.7467 19.7066L54.5333 15.92C53.3333 14.56 52.1333 13.3333 50.7733 12.16L46.9867 16C42.8533 12.64 37.6533 10.6666 32 10.6666C25.6348 10.6666 19.5303 13.1952 15.0294 17.6961C10.5286 22.1969 8 28.3014 8 34.6666C8 41.0318 10.5286 47.1363 15.0294 51.6372C19.5303 56.1381 25.6348 58.6666 32 58.6666C45.3333 58.6666 56 47.92 56 34.6666C56 29.0133 54.0267 23.8133 50.7467 19.7066ZM29.3333 37.3333H34.6667V21.3333H29.3333M40 2.66663H24V7.99996H40V2.66663Z"
                  className="fill-current"
                />
              </svg>              
              <span className="w-[8ch]">{convertSecondsAndMillisecondsToString(sliderMarkers.time)}</span>
            </p>

            <div className="flex-1">
            </div>

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