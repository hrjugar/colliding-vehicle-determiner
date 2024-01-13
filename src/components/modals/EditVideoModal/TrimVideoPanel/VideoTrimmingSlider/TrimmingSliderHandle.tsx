import { useEffect, useRef } from 'react';
import { convertSecondsAndMillisecondsToString } from '@/globals/utils';
import useEditVideoModalStore from "../../store";
import { SliderMarkerType } from "../../types";
import { useShallow } from 'zustand/react/shallow';

interface TrimmingSliderHandleProps {
  setValue: (newValue: number) => void,
  handleType: SliderMarkerType,
  updateVideoFromTimeHandle?: (newTime: number) => void
}

const TrimmingSliderHandle: React.FC<TrimmingSliderHandleProps> = ({
  setValue,
  handleType,
  updateVideoFromTimeHandle
}) => {
  const [
    sliderMarkers,
    videoDuration
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.sliderMarkers,
      state.videoDuration
    ])
  )

  const value = sliderMarkers[handleType];
  const sliderPercentage = value / videoDuration * 100;
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
    const minimumTrimDuration = 0.5;
    const parentRect = handleRef.current?.parentElement!.getBoundingClientRect()!;
    const newPosition = (e.clientX - parentRect.left);
    const newPositionPercentage = newPosition / parentRect.width;

    const newValue = videoDuration * newPositionPercentage;

    switch (handleType) {
      case "start":
        if (newValue + minimumTrimDuration < sliderMarkers.end) {
          setValue(newValue > sliderMarkers.time ? sliderMarkers.time : Math.max(0, newValue));
        }
        break;
      case "end":
        if (newValue - minimumTrimDuration > sliderMarkers.start) {
          setValue(newValue < sliderMarkers.time ? sliderMarkers.time : Math.min(videoDuration, newValue));
        }
        break;
      case "time":
        let finalTimeValue = newValue < sliderMarkers.start ? sliderMarkers.start : 
                             newValue > sliderMarkers.end ? sliderMarkers.end : newValue;
        setValue(finalTimeValue);
        if (updateVideoFromTimeHandle) {
          updateVideoFromTimeHandle(finalTimeValue);
        }
        break;
    }
  }

  useEffect(() => {
    return () => {
      console.log("Removed slider event listeners!")
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointermove', onPointerMove);
    }
  }, []);

  if (handleType === "time") {
    return (
      <div
        ref={handleRef}
        className='absolute bottom-0 flex flex-col justify-start items-center transform -translate-x-1/2 translate-y-[15%] cursor-pointer'
        style={{ left: `${sliderPercentage}%`}}
        onPointerDown={onPointerDown}
      >
        {/* <span className='bg-color-primary text-white text-xs px-4 py-2 rounded-full cursor-pointer'>{convertSecondsAndMillisecondsToString(value)}</span> */}
        <div className='w-[1px] h-20 bg-red-500 cursor-pointer' />
      </div>
    )
  } else {
    return (
      <div
        ref={handleRef}
        className={"absolute transform -translate-x-1/2"}
        style={{ left: `${sliderPercentage}%`}}
      >
        <div 
          className={`absolute ${handleType === 'start' ? 'right-full rounded-l-lg' : 'left-full rounded-r-lg'} w-4 h-[60px] cursor-pointer -translate-y-[2.5%] bg-color-primary flex justify-center items-center`}
          onPointerDown={onPointerDown}
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-8 h-8 text-white"
          >
            <path 
              d="M29.3333 56H24V8H29.3333V56ZM40 8H34.6667V56H40V8Z"
              className="fill-current"
            />
          </svg>           
        </div>
      </div>
    );
  }
};

export default TrimmingSliderHandle;
