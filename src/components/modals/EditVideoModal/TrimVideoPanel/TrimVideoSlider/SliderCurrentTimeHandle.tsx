import React from 'react';
import { GetHandleProps } from 'react-compound-slider';
import { convertSecondsAndMillisecondsToString, convertSecondsToMinutes } from '../../../../../globals/utils';

interface SliderCurrentTimeHandleProps {
  handle: {
    id: string,
    value: number,
    percent: number
  },
  getHandleProps: GetHandleProps,
}

const SliderCurrentTimeHandle: React.FC<SliderCurrentTimeHandleProps> = ({ handle, getHandleProps }) => {
  return (
    <div 
      className={`absolute z-[2] border-none cursor-pointer transform  -translate-x-1/2 -translate-y-[60%] flex flex-col items-center`}
      style={{
        left: `${handle.percent}%`,
      }}
      {...getHandleProps(handle.id)}
    >
      <span className='text-xs font-bold text-color-primary px-2 py-1 bg-color-primary-active rounded-full'>{convertSecondsAndMillisecondsToString(handle.value)}</span>
      {/* <div className='w-3 h-3 bg-color-primary rounded-full'/> */}
      <div className='w-[2px] h-5 bg-color-primary-active'/>
    </div>
  );
};

export default SliderCurrentTimeHandle;
