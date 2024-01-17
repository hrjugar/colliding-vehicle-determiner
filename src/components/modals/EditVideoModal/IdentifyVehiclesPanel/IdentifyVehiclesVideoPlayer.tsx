import React, { useEffect, useRef } from 'react';
import useIdentifyVehiclesPanelStore from './store';
import { useShallow } from 'zustand/react/shallow';
import { convertSecondsToMinutes } from '@/globals/utils';

const IdentifyVehiclesVideoPlayer: React.FC = () => {
  const [
    getSelectedObject,
    duration,
    setDuration,
    isPaused,
    playVideo,
    pauseVideo,
    timePercentage,
    setTimePercentage
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.duration,
      state.setDuration,
      state.isPaused,
      state.playVideo,
      state.pauseVideo,
      state.timePercentage,
      state.setTimePercentage, 
    ])
  )

  const videoRef = useRef<HTMLVideoElement>(null);
  const seekBarMarkerRef = useRef<HTMLDivElement>(null);
  const selectedObject = getSelectedObject();

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

  const handleSliderClick = (e: React.MouseEvent) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const leftPercentage = x / rect.width;
      videoRef.current.currentTime = videoRef.current.duration * leftPercentage;
      setTimePercentage(leftPercentage * 100);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      const parentRect = seekBarMarkerRef.current?.parentElement!.getBoundingClientRect()!;
      const newPosition = (e.clientX - parentRect.left);
      const newPositionPercentage = newPosition / parentRect.width;

      if (newPositionPercentage < 0) {
        videoRef.current.currentTime = 0;
        setTimePercentage(0);
      } else if (newPositionPercentage > 1) {
        videoRef.current.currentTime = videoRef.current.duration;
        setTimePercentage(100);
      } else {
        videoRef.current.currentTime = duration * newPositionPercentage;
        setTimePercentage(newPositionPercentage * 100);
      }
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [])

  return (
    <div className='card w-full h-full flex flex-col'>
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

        <div className={`${isPaused ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 absolute flex justify-center items-center gap-8 text-white transition-opacity`}>
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

      <div className='w-full h-10 px-4 flex justify-center items-center gap-4'>
        {videoRef.current && duration >= 0 ? (
          <p className='text-xs font-medium'>{convertSecondsToMinutes(videoRef.current.currentTime)}/{convertSecondsToMinutes(videoRef.current.duration)}</p>
        ) : null}
        <div 
          className='relative bg-gray-200 w-full h-2 rounded-full flex flex-row items-center'
          onClick={handleSliderClick}
        >
          <div 
            className='absolute h-2 rounded-full bg-color-primary-active/50'
            style={{ width: `${timePercentage}%` }}
          />
          <div 
            className='absolute w-4 h-4 rounded-full bg-color-primary -translate-x-1/2 cursor-pointer'
            ref={seekBarMarkerRef}
            style={{ left: `${timePercentage}%` }}
            onPointerDown={onPointerDown}
          />
        </div>
      </div>
    </div>
  );
};

export default IdentifyVehiclesVideoPlayer;
