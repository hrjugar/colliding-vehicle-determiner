import React from 'react';
import { convertSecondsAndMillisecondsToString, convertSecondsToMinutes } from '@/globals/utils';

interface TrimmingSliderTicksProps {
  duration: number
}

const TrimmingSliderTicks: React.FC<TrimmingSliderTicksProps> = ({ duration }) => {
  return (
    // Add your JSX code here
    <div className='absolute top-0 w-full h-4 transform translate-y-4'>
      {Array(6).fill(0).map((_, i) => {
        return (
          <div 
            className='absolute transform -translate-x-1/2 flex flex-col justify-start items-center'
            style={{ left: `${i * 20}%` }}
            key={`trimming-slider-tick-${i}`}
          >
            <div className='bg-color-primary-inactive w-[1px] h-2.5 mt-0.5'/>
            <span className='text-xs text-color-primary-inactivey'>{convertSecondsAndMillisecondsToString(duration * (i * 0.2))}</span>
          </div>
        )
      })}
      {/* Add your component content here */}
    </div>
  );
};

export default TrimmingSliderTicks;
