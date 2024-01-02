import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface ThresholdHandlerProps {
  name: string,
  threshold: number,
  setThreshold: (threshold: number) => void
}

const ThresholdHandler: React.FC<ThresholdHandlerProps> = ({ 
  name,
  threshold,
  setThreshold
}) => {
  const thresholdSliderRef = useRef<HTMLDivElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setThreshold(0);
      return;
    }

    const intValue = parseInt(value);

    if (isNaN(intValue)) {
      toast("Threshold must be a number.", { type: 'error', autoClose: 2000 });
      return;
    }

    if (intValue < 0 || intValue > 100) {
      toast("Threshold must be between 0 and 1.", { type: 'error', autoClose: 2000 });
      return;
    }

    console.log(`input value is ${intValue}`)
    setThreshold(intValue);
  }

  const onSliderClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftPercentage = x / rect.width;
    const newThreshold = Math.round(leftPercentage * 100);
    setThreshold(newThreshold);
  };  

  const onSliderPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', onSliderPointerMove);
    document.removeEventListener('pointerup', onSliderPointerUp);
  };

  const onSliderPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', onSliderPointerMove);
    document.addEventListener('pointerup', onSliderPointerUp);
  };

  const onSliderPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    const parentRect = thresholdSliderRef.current?.getBoundingClientRect()!;
    const newPosition = (e.clientX - parentRect.left);
    const newPositionPercentage = Math.round(newPosition / parentRect.width * 100);

    if (newPositionPercentage < 0) {
      setThreshold(0);
    } else if (newPositionPercentage > 100) {
      setThreshold(100);
    } else {
      setThreshold(newPositionPercentage);
    }
  };

  useEffect(() => {
    return () => {
      console.log("Removed slider event listeners!")
      document.removeEventListener('pointerup', onSliderPointerUp);
      document.removeEventListener('pointermove', onSliderPointerMove);
    }
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row gap-4 justify-between items-center'>
        <p className='text-sm font-medium text-black whitespace-nowrap'>{name} Threshold</p>
        <div className='flex flex-row items-start'>
          <input
            type='text' 
            className='text-color-primary bg-transparent font-semibold w-[3ch] text-end text-sm px-0'
            value={threshold}
            onChange={onInputChange}
          />
          <p className='text-sm'>%</p>
        </div>
      </div>

      <div 
        ref={thresholdSliderRef}
        className='relative w-full h-2 flex flex-row items-center bg-color-primary rounded-full'
        onClick={onSliderClick}
      >
        <div 
          className='absolute w-4 h-4 rounded-full bg-white border-2 border-color-primary transform -translate-x-1/2 cursor-pointer'
          style={{ left: `${threshold}%` }}
          onPointerDown={onSliderPointerDown}
        />
      </div>
    </div>
  );
};

export default ThresholdHandler;
