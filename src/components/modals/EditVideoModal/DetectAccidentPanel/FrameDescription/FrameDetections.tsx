
import React, { useReducer } from 'react';
import { FramePrediction, hiddenPredictionIndexesAction } from '..';
import { Transition } from '@headlessui/react';

interface FrameDetectionsProps {
  prediction: FramePrediction,
  selectedFrame: number,
  hiddenPredictionIndexes: number[],
  dispatchHiddenPredictionIndexes: React.Dispatch<hiddenPredictionIndexesAction>
}

type Action = { type: 'TOGGLE'; index: number };

const reducer = (state: boolean[], index: number): boolean[] => {
  const updatedDetections = [...state];
  updatedDetections[index] = !updatedDetections[index];
  return updatedDetections;
};

const FrameDetections: React.FC<FrameDetectionsProps> = ({ 
  prediction, 
  selectedFrame,
  hiddenPredictionIndexes,
  dispatchHiddenPredictionIndexes
}) => {
  const [descriptionToggles, dispatchDescriptionToggles] = useReducer(reducer, Array(prediction.length).fill(true));

  return (
    <div className='h-full flex-col'>
      <div className='flex flex-col h-full'>
        {prediction && prediction.length > 0 ? (
          prediction.map((detection, index) => {
            return (
              <div
                key={`detection-${selectedFrame}-${index}`}
                className='flex flex-col justify-start'
              >
                <div className='flex flex-row justify-between items-center'>
                  <div 
                    className='flex flex-row items-center gap-1'
                    onClick={() => dispatchDescriptionToggles(index)}
                  >
                    <svg 
                      width="64" 
                      height="64" 
                      viewBox="0 0 64 64" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-color-primary transition-transform duration-300 transform ${descriptionToggles[index] ? 'rotate-90' : 'rotate-0'}`}
                    >
                      <path 
                        d="M22 18 L22 46 L42 32 Z"
                        className='fill-current'
                      />
                    </svg>               
                    <p className='text-sm select-none'>Box {index + 1}</p>
                  </div>

                  {hiddenPredictionIndexes.includes(index) ? (
                    <button
                      type='button'
                      className='flex justify-center items-center p-1 hover:bg-gray-200 rounded-full'
                      onClick={() => dispatchHiddenPredictionIndexes({ type: 'REMOVE', value: index })}
                    >
                      <svg 
                        width="64" 
                        height="64" 
                        viewBox="0 0 64 64" 
                        xmlns="http://www.w3.org/2000/svg"
                        className='w-4 h-4'
                      >
                        <path 
                          d="M5.33332 14.0533L8.74666 10.6666L53.3333 55.2533L49.9467 58.6666L41.7333 50.4533C38.6667 51.4666 35.4133 52 32 52C18.6667 52 7.27999 43.7066 2.66666 32C4.50666 27.3066 7.43999 23.1733 11.1733 19.8933L5.33332 14.0533ZM32 24C34.1217 24 36.1566 24.8428 37.6568 26.3431C39.1571 27.8434 40 29.8782 40 32C40.0013 32.9081 39.848 33.8099 39.5467 34.6666L29.3333 24.4533C30.19 24.1519 31.0918 23.9986 32 24ZM32 12C45.3333 12 56.72 20.2933 61.3333 32C59.1569 37.5285 55.4585 42.3272 50.6667 45.84L46.88 42.0266C50.5677 39.4756 53.5419 36.0241 55.52 32C53.3642 27.5998 50.0171 23.8927 45.8594 21.3C41.7016 18.7073 36.8999 17.333 32 17.3333C29.0933 17.3333 26.24 17.8133 23.5733 18.6666L19.4667 14.5866C23.3067 12.9333 27.5467 12 32 12ZM8.47999 32C10.6358 36.4001 13.9828 40.1072 18.1406 42.6999C22.2984 45.2927 27.1001 46.6669 32 46.6666C33.84 46.6666 35.6533 46.48 37.3333 46.1066L31.2533 40C29.3978 39.8011 27.6662 38.973 26.3466 37.6534C25.027 36.3338 24.1989 34.6022 24 32.7466L14.9333 23.6533C12.2933 25.92 10.08 28.7466 8.47999 32Z"
                          className='fill-current'
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='flex justify-center items-center p-1 hover:bg-gray-200 rounded-full'
                      onClick={() => dispatchHiddenPredictionIndexes({ type: 'ADD', value: index })}
                    >
                      <svg 
                        width="64" 
                        height="64" 
                        viewBox="0 0 64 64" 
                        xmlns="http://www.w3.org/2000/svg"
                        className='w-4 h-4'
                      >
                        <path 
                          d="M32 24C34.1218 24 36.1566 24.8429 37.6569 26.3431C39.1572 27.8434 40 29.8783 40 32C40 34.1217 39.1572 36.1566 37.6569 37.6569C36.1566 39.1571 34.1218 40 32 40C29.8783 40 27.8435 39.1571 26.3432 37.6569C24.8429 36.1566 24 34.1217 24 32C24 29.8783 24.8429 27.8434 26.3432 26.3431C27.8435 24.8429 29.8783 24 32 24ZM32 12C45.3334 12 56.72 20.2933 61.3334 32C56.72 43.7067 45.3334 52 32 52C18.6667 52 7.28002 43.7067 2.66669 32C7.28002 20.2933 18.6667 12 32 12ZM8.48002 32C10.6354 36.4008 13.9822 40.1087 18.14 42.702C22.2978 45.2954 27.0997 46.6702 32 46.6702C36.9003 46.6702 41.7023 45.2954 45.8601 42.702C50.0179 40.1087 53.3647 36.4008 55.52 32C53.3647 27.5992 50.0179 23.8913 45.8601 21.298C41.7023 18.7046 36.9003 17.3298 32 17.3298C27.0997 17.3298 22.2978 18.7046 18.14 21.298C13.9822 23.8913 10.6354 27.5992 8.48002 32Z"
                          className='fill-current'
                        />
                      </svg>
                    </button>
                  )}

                </div>

                <div className={`grid transition-all duration-300 ${descriptionToggles[index] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className='flex flex-col pl-6 pt-1 overflow-y-hidden'>
                    <div className='flex flex-row justify-between items-center text-xs'>
                      <p className='font-medium'>x</p>
                      <p>{detection.x.toFixed(2)}</p>
                    </div>
                    
                    <div className='flex flex-row justify-between items-center text-xs'>
                      <p className='font-medium'>y</p>
                      <p>{detection.y.toFixed(2)}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center text-xs'>
                      <p className='font-medium'>width</p>
                      <p>{detection.w.toFixed(2)}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center text-xs'>
                      <p className='font-medium'>height</p>
                      <p>{detection.h.toFixed(2)}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center text-xs'>
                      <p className='font-medium'>confidence</p>
                      <p>{(detection.confidence * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ): <p>No Predictions</p>}
      </div>
    </div>
  );
};

export default FrameDetections;
