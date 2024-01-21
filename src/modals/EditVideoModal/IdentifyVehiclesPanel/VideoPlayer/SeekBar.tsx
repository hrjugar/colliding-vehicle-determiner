import { useShallow } from "zustand/react/shallow";
import useIdentifyVehiclesPanelStore from "../store";
import { convertSecondsToMinutes, getBoundingBoxColor } from "@/globals/utils";
import { useEffect, useRef } from "react";
import useEditVideoModalStore from "../../store";

interface SeekBarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const SeekBar: React.FC<SeekBarProps> = ({ videoRef }) => {
  const fps = useEditVideoModalStore((state) => state.fps);
  
  const [
    getSelectedObject,
    duration,
    timePercentage,
    setTimePercentage
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.getSelectedObject,
      state.duration,
      state.timePercentage,
      state.setTimePercentage,
      state.selectedObjectId,
    ])
  );

  const selectedObject = getSelectedObject();
  const seekBarMarkerRef = useRef<HTMLDivElement>(null);

  console.log(`Selected object is ${selectedObject?.id ?? 'none'}`);

  const getSelectedObjectSeekBarAreas = () => {
    if (selectedObject && videoRef.current) {
      const frameGroupList: number[][] = [];
      let currentFrameGroup: number[] = [];

      selectedObject.frames.forEach((frame, index) => {
        if (index === 0 || frame.frame === selectedObject.frames[index - 1].frame + 1) {
          currentFrameGroup.push(frame.frame);
        } else {
          frameGroupList.push([currentFrameGroup[0], currentFrameGroup[currentFrameGroup.length - 1]]);
          currentFrameGroup = [frame.frame];
        }
      })

      if (currentFrameGroup.length > 0) {
        frameGroupList.push([currentFrameGroup[0], currentFrameGroup[currentFrameGroup.length - 1]]);
      }

      const selectedObjectSeekBarAreas = [];
      for (const frameGroup of frameGroupList) {
        const startPercentage = ((frameGroup[0] - 1) / (videoRef.current.duration * fps)) * 100;
        const endPercentage = (frameGroup[frameGroup.length - 1] / (videoRef.current.duration * fps)) * 100;
        const widthPercentage = endPercentage - startPercentage;

        selectedObjectSeekBarAreas.push(
          <div 
            key={`selected-object-seek-bar-area-${frameGroup[0]}`} 
            className='absolute h-full min-w-[1px]'
            style={{ left: `${startPercentage}%`, width: `${widthPercentage}%`, backgroundColor: getBoundingBoxColor(selectedObject.id) }}
          />
        )
      }

      return selectedObjectSeekBarAreas;
    }

    return null;
  }

  const handleSliderClick = (e: React.MouseEvent) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const leftPercentage = x / rect.width;
      videoRef.current.currentTime = videoRef.current.duration * leftPercentage;
      setTimePercentage(leftPercentage * 100);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      const parentRect = seekBarMarkerRef.current?.parentElement!.getBoundingClientRect()!;
      const newPosition = (e.clientX - parentRect.left);
      const newPositionPercentage = newPosition / parentRect.width;

      if (newPositionPercentage < 0) {
        videoRef.current.currentTime = 0;
        setTimePercentage(0);
      } else if (newPositionPercentage > 1) {
        videoRef.current.currentTime = videoRef.current.duration;
        setTimePercentage(100);
      } else {
        videoRef.current.currentTime = duration * newPositionPercentage;
        setTimePercentage(newPositionPercentage * 100);
      }
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [])
  
  return (
    <div className='w-full h-10 px-4 flex justify-center items-center gap-4'>
    {videoRef.current && duration >= 0 ? (
      <p className='text-xs font-medium'>{convertSecondsToMinutes(videoRef.current.currentTime)}/{convertSecondsToMinutes(videoRef.current.duration)}</p>
    ) : null}
    <div 
      className='relative bg-gray-200 w-full h-2 rounded-full flex flex-row items-center'
      onClick={handleSliderClick}
    >
      {getSelectedObjectSeekBarAreas()}
      <div 
        className='absolute h-2 rounded-full bg-color-primary-active/50'
        style={{ width: `${timePercentage}%` }}
      />
      <div 
        className='absolute w-4 h-4 rounded-full bg-color-primary -translate-x-1/2 cursor-pointer'
        ref={seekBarMarkerRef}
        style={{ left: `${timePercentage}%` }}
        onPointerDown={onPointerDown}
      />
    </div>
  </div>
  );
};

export default SeekBar;
