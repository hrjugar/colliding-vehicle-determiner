import React, { useEffect } from 'react';
import { FramePrediction } from '..';
import { getBoundingBoxColor } from '@/globals/utils';

interface SelectFrameImageProps {
  selectedFrame: number,
  prediction: FramePrediction,
  isFrameTransitionDone: boolean,
  hiddenPredictionIndexes: Set<number>
}

const SelectFrameImage: React.FC<SelectFrameImageProps> = ({ 
  selectedFrame, 
  prediction, 
  isFrameTransitionDone, 
  hiddenPredictionIndexes 
}) => {

  return (
    <div className='bg-black flex justify-center items-center w-full'>
      <div className='relative inline-block'>
        <img
          src={`fileHandler://tempFrame//${selectedFrame + 1}`}
          className='object-contain'
        />
        
        {prediction && prediction.length > 0 ? (
          prediction.map((item, index) => {
            if (hiddenPredictionIndexes.has(index)) {
              return null;
            }

            return (
              <div 
                key={`prediction-${selectedFrame}-${index}`}
                className={`absolute border-2 border-primary ${isFrameTransitionDone ? 'animate-scale-up' : ''}`}
                style={{
                  borderColor: getBoundingBoxColor(index),
                  left: `${(item.xn - item.wn / 2) * 100}%`,
                  top: `${(item.yn - item.hn / 2) * 100}%`,
                  width: `${(item.wn) * 100}%`,
                  height: `${(item.hn) * 100}%`,
                  zIndex: Math.round(item.confidence * 100),
                  transformOrigin: 'top left',
                }}
              />
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default SelectFrameImage;
