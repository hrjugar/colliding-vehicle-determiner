import { useEffect, useRef } from 'react';
import useIdentifyVehiclesPanelStore from '../store';
import { useShallow } from 'zustand/react/shallow';
import { convertSecondsToMinutes } from '@/globals/utils';
import SeekBar from './SeekBar';
import useEditVideoModalStore from '../../store';

const VideoPlayer: React.FC = () => {
  const fps = useEditVideoModalStore((state) => state.fps);

  const [
    selectedFrame,
    setDuration,
    isPaused,
    playVideo,
    pauseVideo,
    setTimePercentage
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.selectedFrame,
      state.setDuration,
      state.isPaused,
      state.playVideo,
      state.pauseVideo,
      state.setTimePercentage, 
    ])
  )

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSkip = (isBackwards : boolean) => {
    if (videoRef.current) {
      videoRef.current.currentTime = isBackwards ? 0 : videoRef.current.duration;
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
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setTimePercentage(currentTime / videoRef.current.duration * 100);
    }
  };

  const handleOnLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  useEffect(() => {
    if (selectedFrame === -1) return;

    if (videoRef.current) {
      const frameTime = selectedFrame / fps;
      videoRef.current.currentTime = frameTime;
    }
  }, [selectedFrame]);

  return (
    <div className='card w-full max-h-[60vh] flex flex-col'>
      <div className='group relative bg-black w-full h-full flex justify-center items-center overflow-hidden'>
        <video
          ref={videoRef}
          className="w-full max-h-full flex object-contain"
          muted
          onEnded={pauseVideo}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleOnLoadedMetadata}
        >
          <source 
            src={`http://localhost:3000/video?source=app&temp=true`} 
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

      <SeekBar videoRef={videoRef} />
    </div>
  );
};

export default VideoPlayer;
