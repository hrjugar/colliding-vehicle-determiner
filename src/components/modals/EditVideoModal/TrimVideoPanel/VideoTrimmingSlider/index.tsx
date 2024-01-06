import React from 'react';
import TrimmingSliderHandle from './TrimmingSliderHandle';
import TrimmingSliderTicks from './TrimmingSliderTicks';
import { toast } from 'react-toastify';
import useEditVideoModalStore from '@/stores/useEditVideoModalStore';
import { useShallow } from 'zustand/react/shallow';

interface VideoTrimmingSliderProps {
  updateVideoFromTimeHandle: (newTime: number) => void
}

const VideoTrimmingSlider: React.FC<VideoTrimmingSliderProps> = ({ 
  updateVideoFromTimeHandle
}) => {
  const [
    duration,
    sliderMarkers,
    setStartMarker,
    setTimeMarker,
    setEndMarker,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoMetadata.duration,
      state.sliderMarkers,
      state.setStartMarker,
      state.setTimeMarker,
      state.setEndMarker,
    ])
  )

  const handleSliderClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftPercentage = x / rect.width;
    const newTime = duration * leftPercentage;

    if (newTime < sliderMarkers.start || newTime > sliderMarkers.end) {
      toast(`Time must be within the start and end constraints`, { type: "error", autoClose: 3000 })
      return;
    }

    setTimeMarker(newTime);
    
    if (updateVideoFromTimeHandle) {
      updateVideoFromTimeHandle(newTime);
    }
  };

  return (
    <div className='w-full pt-8 pb-6 px-10'>
      <div 
        className="relative bg-gray-200 w-full h-4 rounded-full"
      >
        <div 
          className='absolute h-full w-4 bg-color-primary-active'
          style={{ 
            left: `${(sliderMarkers.start / duration) * 100}%`,
            width: `${((sliderMarkers.end - sliderMarkers.start) / duration) * 100}%`
          }}
        />

        <div 
          className='absolute w-full h-full rounded-full'
          onClick={handleSliderClick}
        />

        <TrimmingSliderHandle 
          setValue={(newStart) => setStartMarker(newStart)}
          handleType='start'
        />
        <TrimmingSliderHandle 
          setValue={(newEnd) => setEndMarker(newEnd)}
          handleType='end'
        />
        <TrimmingSliderHandle 
          setValue={(newTime) => setTimeMarker(newTime)}
          handleType='time'
          updateVideoFromTimeHandle={updateVideoFromTimeHandle}
        />
        <TrimmingSliderTicks />
      </div>
    </div>
  );
};

export default VideoTrimmingSlider;
