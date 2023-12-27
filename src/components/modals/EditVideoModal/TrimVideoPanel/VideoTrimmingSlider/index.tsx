import React, { useReducer } from 'react';
import TrimmingSliderHandle from './TrimmingSliderHandle';

interface VideoTrimmingSliderProps {
  duration: number
}

export interface SliderMarkersState {
  start: number;
  time: number;
  end: number;
}

type SliderMarkersAction = (
  { type: 'SET_START'; payload: number } | 
  { type: 'SET_TIME'; payload: number } | 
  { type: 'SET_END'; payload: number }
);

const sliderMarkersReducer = (
  state: SliderMarkersState,
  action: SliderMarkersAction
): SliderMarkersState => {
  switch (action.type) {
    case 'SET_START':
      return { ...state, start: action.payload };
    case 'SET_TIME':
      return { ...state, time: action.payload };
    case 'SET_END':
      return { ...state, end: action.payload };
    default:
      return state;
  }
};

const VideoTrimmingSlider: React.FC<VideoTrimmingSliderProps> = ({ duration }) => {
  const [markers, markersDispatch] = useReducer(sliderMarkersReducer, {
    start: 0,
    time: 0,
    end: duration
  });

  const handleSliderClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftPercentage = x / rect.width;
    const newTime = duration * leftPercentage;
    markersDispatch({ type: 'SET_TIME', payload: newTime });
  };

  return (
    <div 
      className="relative bg-gray-200 w-full h-4 rounded-full"
    >
      <div 
        className='absolute w-full h-full rounded-full'
        onClick={handleSliderClick}
      />
      <TrimmingSliderHandle 
        duration={duration}
        sliderMarkers={markers}
        setValue={(newStart) => markersDispatch({ type: 'SET_START', payload: newStart })}
        handleType='start'
      />
      <TrimmingSliderHandle 
        duration={duration}
        sliderMarkers={markers}
        setValue={(newStart) => markersDispatch({ type: 'SET_END', payload: newStart })}
        handleType='end'
      />
    </div>
  );
};

export default VideoTrimmingSlider;
