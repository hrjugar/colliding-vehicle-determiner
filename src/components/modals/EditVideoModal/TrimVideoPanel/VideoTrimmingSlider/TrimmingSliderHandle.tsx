import { useEffect, useRef } from 'react';
import { convertSecondsAndMillisecondsToString } from '@/globals/utils';
import useEditVideoModalStore from "../../store";
import { SliderMarkerType } from "../../types";
import { useShallow } from 'zustand/react/shallow';

interface TrimmingSliderHandle {
  setValue: (newValue: number) => void,
  handleType: SliderMarkerType,
  updateVideoFromTimeHandle?: (newTime: number) => void
}

const TrimmingSliderHandle: React.FC<TrimmingSliderHandle> = ({
  setValue,
  handleType,
  updateVideoFromTimeHandle
}) => {
  const [
    sliderMarkers,
    duration
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.sliderMarkers,
      state.videoMetadata.duration
    ])
  )

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
      if (
        (handleType === "start" && newValue + 0.5 < sliderMarkers.end && newValue <= sliderMarkers.time) ||
        (handleType === "end" && newValue - 0.5 > sliderMarkers.start && newValue >= sliderMarkers.time) ||
        (handleType === "time" && newValue >= sliderMarkers.start && newValue <= sliderMarkers.end)
      ) {
        setValue(newValue);

        if (handleType === "time" && updateVideoFromTimeHandle) {
          updateVideoFromTimeHandle(newValue);
        }
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

  if (handleType === "time") {
    return (
      <div
        ref={handleRef}
        className='absolute bottom-0 flex flex-col justify-start items-center transform -translate-x-1/2 cursor-pointer'
        style={{ left: `${sliderPercentage}%`}}
        onPointerDown={onPointerDown}
      >
        <span className='bg-color-primary text-white text-xs px-4 py-2 rounded-full cursor-pointer'>{convertSecondsAndMillisecondsToString(value)}</span>
        <div className='w-[1px] h-5 bg-color-primary cursor-pointer' />
      </div>
    )
  } else {
    return (
      <div
        ref={handleRef}
        className={"absolute w-4 h-4 rounded-full bg-white border-2 border-color-primary cursor-pointer transform -translate-x-1/2"}
        style={{ left: `${sliderPercentage}%`}}
        onPointerDown={onPointerDown}
      />
    );
  }
};

export default TrimmingSliderHandle;
