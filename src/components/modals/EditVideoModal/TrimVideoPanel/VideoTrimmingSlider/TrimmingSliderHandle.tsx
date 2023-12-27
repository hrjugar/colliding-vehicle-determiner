import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SliderMarkersState } from '.';

interface TrimmingSliderHandle {
  duration: number,
  sliderMarkers: SliderMarkersState,
  setValue: (newValue: number) => void,
  handleType: "start" | "time" | "end"
}

const TrimmingSliderHandle: React.FC<TrimmingSliderHandle> = ({
  duration,
  sliderMarkers,
  setValue,
  handleType
}) => {
  const value = sliderMarkers[handleType];
  const sliderPercentage = value / duration * 100;
  const handleRef = useRef<HTMLDivElement>(null);

  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    const parentRect = handleRef.current?.parentElement!.getBoundingClientRect()!;
    const newPosition = (e.clientX - parentRect.left);
    const newPositionPercentage = newPosition / parentRect.width;

    if (newPositionPercentage >= 0 && newPositionPercentage <= 1) {
      const newValue = duration * newPositionPercentage;
      console.log(sliderMarkers);
      if (
        (handleType === "start" && newValue + 0.5 < sliderMarkers.end) ||
        (handleType === "end" && newValue - 0.5 > sliderMarkers.start) ||
        (handleType === "time" && newValue >= sliderMarkers.start && newValue <= sliderMarkers.end) 
      ) {
        setValue(newValue);
      }
    }
  }

  useEffect(() => {
    return () => {
      console.log("Removed slider event listeners!")
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointermove', onPointerMove);
    }
  }, []);

  return (
    <div
      ref={handleRef}
      className="absolute w-4 h-4 rounded-full bg-white border-2 border-color-primary cursor-pointer transform -translate-x-1/2"
      style={{ left: `${sliderPercentage}%`}}
      onPointerDown={onPointerDown}
    />
  );
};

export default TrimmingSliderHandle;
