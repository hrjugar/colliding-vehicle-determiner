import React, { useEffect } from 'react';
import { FramePrediction } from '..';

interface SelectFrameImageProps {
  selectedFrame: number,
  prediction: FramePrediction,
  isLoadingDone: boolean,
}

const getBoundingBoxColor = (number: number): string => {
  const hue = (number * 137.5) % 360;
  const saturation = 100;
  const lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const SelectFrameImage: React.FC<SelectFrameImageProps> = ({ selectedFrame, prediction, isLoadingDone }) => {

  return (
    <div className='bg-black flex justify-center items-center w-full'>
      <div className='relative inline-block'>
        <img
          src={`fileHandler://tempFrame//${selectedFrame + 1}`}
          className='object-contain'
        />
        
        {prediction && prediction.length > 0 ? (
          prediction.map((item, index) => (
            <div 
              key={`prediction-${selectedFrame}-${index}`}
              className={`absolute border-2 border-primary ${isLoadingDone ? 'animate-scale-up' : ''}`}
              style={{
                borderColor: getBoundingBoxColor(index),
                left: `${(item.xn - item.wn / 2) * 100}%`,
                top: `${(item.yn - item.hn / 2) * 100}%`,
                width: `${(item.wn) * 100}%`,
                height: `${(item.hn) * 100}%`,
                zIndex: Math.round(item.confidence * 100),
                transformOrigin: 'top left',
                // transform: isLoadingDone ? 'scale(0)' : 'scale(1)'
              }}
            />
          ))
        ) : null}
      </div>
    </div>
  );
};

export default SelectFrameImage;
