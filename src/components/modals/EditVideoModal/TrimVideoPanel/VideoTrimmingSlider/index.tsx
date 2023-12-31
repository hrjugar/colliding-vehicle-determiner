import React, { useReducer } from 'react';
import TrimmingSliderHandle from './TrimmingSliderHandle';
import TrimmingSliderTicks from './TrimmingSliderTicks';
import { SliderMarkersAction, SliderMarkersState } from '../..';
import { toast } from 'react-toastify';

interface VideoTrimmingSliderProps {
  duration: number,
  sliderMarkers: SliderMarkersState,
  sliderMarkersDispatch: React.Dispatch<SliderMarkersAction>,
  updateVideoFromTimeHandle: (newTime: number) => void
}

const VideoTrimmingSlider: React.FC<VideoTrimmingSliderProps> = ({ 
  duration,
  sliderMarkers,
  sliderMarkersDispatch,
  updateVideoFromTimeHandle
}) => {
  const handleSliderClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftPercentage = x / rect.width;
    const newTime = duration * leftPercentage;

    if (newTime < sliderMarkers.start || newTime > sliderMarkers.end) {
      toast(`Time must be within the start and end constraints`, { type: "error", autoClose: 3000 })
      return;
    }

    sliderMarkersDispatch({ type: 'SET_TIME', payload: newTime });
    
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
          duration={duration}
          sliderMarkers={sliderMarkers}
          setValue={(newStart) => sliderMarkersDispatch({ type: 'SET_START', payload: newStart })}
          handleType='start'
        />
        <TrimmingSliderHandle 
          duration={duration}
          sliderMarkers={sliderMarkers}
          setValue={(newEnd) => sliderMarkersDispatch({ type: 'SET_END', payload: newEnd })}
          handleType='end'
        />
        <TrimmingSliderHandle 
          duration={duration}
          sliderMarkers={sliderMarkers}
          setValue={(newTime) => sliderMarkersDispatch({ type: 'SET_TIME', payload: newTime })}
          handleType='time'
          updateVideoFromTimeHandle={updateVideoFromTimeHandle}
        />
        <TrimmingSliderTicks 
          duration={duration}
        />
      </div>
    </div>
  );
};

export default VideoTrimmingSlider;
