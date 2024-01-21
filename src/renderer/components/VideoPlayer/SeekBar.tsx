import { convertSecondsToMinutes } from "@renderer/globals/utils";
import { useEffect, useRef } from "react";

interface SeekBarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  fps: number;
  timePercentage: number;
  setTimePercentage: (timePercentage: number) => void;
  markSeekBarAreas?: (duration: number, fps: number) => React.ReactNode;
}

const SeekBar: React.FC<SeekBarProps> = ({
  videoRef,
  duration,
  fps,
  timePercentage,
  setTimePercentage,
  markSeekBarAreas,
}) => {
  const seekBarMarkerRef = useRef<HTMLDivElement>(null);

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
    <div className='w-full h-10 px-4 flex justify-center items-center gap-4'>
    {videoRef.current && duration >= 0 ? (
      <p className='text-xs font-medium'>{convertSecondsToMinutes(videoRef.current.currentTime)}/{convertSecondsToMinutes(videoRef.current.duration)}</p>
    ) : null}
    <div 
      className='relative bg-gray-200 w-full h-2 rounded-full flex flex-row items-center'
      onClick={handleSliderClick}
    >
      {markSeekBarAreas ? markSeekBarAreas(duration, fps) : null}

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
  );
}

export default SeekBar;