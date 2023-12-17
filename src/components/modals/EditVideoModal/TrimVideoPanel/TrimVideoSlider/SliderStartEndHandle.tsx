import React from 'react';
import { GetHandleProps } from 'react-compound-slider';
import { convertSecondsAndMillisecondsToString } from '../../../../../globals/utils';

interface SliderStartEndHandleProps {
  handle: {
    id: string,
    value: number,
    percent: number
  },
  getHandleProps: GetHandleProps,
}

const SliderStartEndHandle: React.FC<SliderStartEndHandleProps> = ({ handle, getHandleProps }) => {
  
  return (
    <div 
      className={`absolute z-[2] border-none cursor-pointer transform  -translate-x-1/2 -translate-y-[60%] flex flex-col items-center`}
      style={{
        left: `${handle.percent}%`,
      }}
      {...getHandleProps(handle.id)}
    >
      <span className='text-xs bg-color-primary/90 text-white px-2 py-1 rounded-full'>
        {convertSecondsAndMillisecondsToString(handle.value)}
      </span>
      {/* <div className='w-3 h-3 bg-color-primary rounded-full'/> */}
      <div className='w-[1px] h-14 bg-color-primary'/>
    </div>
  );
};

export default SliderStartEndHandle;
