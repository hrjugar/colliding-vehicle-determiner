import { Tab } from "@headlessui/react"
import { useEffect, useRef, useState } from "react";
import TrimVideoSlider from "./TrimVideoSlider";

interface TrimVideoPanelProps {
  videoPath: string
}

interface VideoState {
  isInitiallyLoading: boolean,
  duration: number
}

// TODO: Fix part where going to previous tab and then back to this tab causes the states to not reset
const TrimVideoPanel: React.FC<TrimVideoPanelProps> = ({ videoPath }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoState>({
    isInitiallyLoading: true,
    duration: 0
  });
  const [sliderHandleValues, setSliderHandleValues] = useState<number[]>([0, 0, 0]);
  const sliderHandleValuesRef = useRef(sliderHandleValues);

  const handleVideoSkip = (isBackwards : boolean) => {
    if (videoRef.current) {
      videoRef.current.currentTime = isBackwards ? sliderHandleValues[0] : sliderHandleValues[2];
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }

  const handleSliderOnSlideEnd = (newValues: readonly number[]) => {
    const oldTime = sliderHandleValues[1];
    const newTime = newValues[1];

    console.log(`oldTime: ${oldTime}, newTime: ${newTime}`)
    
    if (Math.abs(newTime - oldTime) < 0.01) {
      console.log('Handling start/end marker change')
      setSliderHandleValues(Array.from(newValues))
    } else if (videoRef.current) {
      console.log('Handling current time marker change')
      videoRef.current.currentTime = newTime;
    }
  }

  useEffect(() => {
    sliderHandleValuesRef.current = sliderHandleValues;
  }, [sliderHandleValues]);

  useEffect(() => {
    const handleInitialLoading = () => {
      console.log("handleInitialLoading: here")

      if (videoRef.current && videoRef.current.readyState >= 3) {
        const duration = videoRef.current!.duration
        console.log(`duration: ${duration}`)
        setVideoMetadata((prevState) => ({...prevState,
          isInitiallyLoading: false,
          duration
        }))
        setSliderHandleValues([0, 0, duration])
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime

        if (currentTime > sliderHandleValuesRef.current[2]) {
          console.log(`currentTime : ${currentTime}, handle values: ${sliderHandleValuesRef.current.join(" - ")}`)
          console.log("current time is greater than filter")
          videoRef.current.currentTime = sliderHandleValuesRef.current[0];
          videoRef.current.pause();
        }
        
        setSliderHandleValues((prevState) => {
          return [prevState[0], currentTime, prevState[2]]
        })
      }
    };

    const handleVideoEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = sliderHandleValuesRef.current[0];
        videoRef.current.pause();
      }
    }
    
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleInitialLoading)
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate)
      videoRef.current.addEventListener('ended', handleVideoEnded)
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleInitialLoading)
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        videoRef.current.removeEventListener('ended', handleVideoEnded)
      }
    }
  }, [])

  return (
    <Tab.Panel className='w-full h-full flex flex-col justify-start items-center gap-2'>
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
        <video
          className="max-w-full max-h-full flex object-scale-down aspect-video"
          muted
          ref={videoRef}
        >
          <source 
            src={`http://localhost:3000/video?path=${videoPath}`} 
            type="video/mp4" 
          />
        </video>
        
      </div>

      {videoMetadata.isInitiallyLoading ? null : (
        <div className="w-full flex flex-col justify-center items-center py-4 px-6 gap-2">
          <div className="w-full flex justify-center items-center gap-4">
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
                d={videoRef.current?.paused ? (
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

          <TrimVideoSlider
            values={sliderHandleValues}
            duration={videoMetadata.duration}
            handleSliderOnSlideEnd={handleSliderOnSlideEnd}
          />
          
        </div>
      )}

    </Tab.Panel>
  )
}

export default TrimVideoPanel;