import TrimmingSliderHandle from './TrimmingSliderHandle';
import TrimmingSliderTicks from './TrimmingSliderTicks';
import { toast } from 'react-toastify';
import useEditVideoModalStore from "../../store";
import { useShallow } from 'zustand/react/shallow';
import TrimmingSliderFrames from './TrimmingSliderFrames';

interface VideoTrimmingSliderProps {
  updateVideoFromTimeHandle: (newTime: number) => void
}

const VideoTrimmingSlider: React.FC<VideoTrimmingSliderProps> = ({ 
  updateVideoFromTimeHandle
}) => {
  const [
    videoDuration,
    sliderMarkers,
    setStartMarker,
    setTimeMarker,
    setEndMarker,
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.videoDuration,
      state.sliderMarkers,
      state.setStartMarker,
      state.setTimeMarker,
      state.setEndMarker,
    ])
  )

  const handleSliderClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftPercentage = x / rect.width;
    const newTime = videoDuration * leftPercentage;

    if (newTime < sliderMarkers.start || newTime > sliderMarkers.end) {
      toast(`Time must be within the start and end constraints`, { type: "error", autoClose: 3000 })
      return;
    }

    setTimeMarker(newTime);
    
    if (updateVideoFromTimeHandle) {
      updateVideoFromTimeHandle(newTime);
    }
  };

  return (
    <div className='w-full pt-2 pb-6 px-6'>
      <div 
        className="relative w-full h-14"
      >
        <TrimmingSliderFrames />

        <div 
          className='absolute h-full bg-black/25 left-0'
          style={{ 
            width: `${((sliderMarkers.start) / videoDuration) * 100}%`
          }}
        />

        <div 
          className='absolute h-[60px] -translate-y-[3.33%] border-y-2 border-color-primary bg-color-primary-active/25'
          style={{ 
            left: `${(sliderMarkers.start / videoDuration) * 100}%`,
            width: `${((sliderMarkers.end - sliderMarkers.start) / videoDuration) * 100}%`
          }}
        />

        <div 
          className='absolute h-full bg-black/25 right-0'
          style={{ 
            width: `${((videoDuration - sliderMarkers.end) / videoDuration) * 100}%`
          }}
        />        

        <div 
          className='absolute w-full h-full'
          onClick={handleSliderClick}
        />

        <TrimmingSliderHandle 
          setValue={(newStart) => setStartMarker(newStart)}
          handleType='start'
        />
        <TrimmingSliderHandle 
          setValue={(newEnd) => setEndMarker(newEnd)}
          handleType='end'
        />
        <TrimmingSliderHandle 
          setValue={(newTime) => setTimeMarker(newTime)}
          handleType='time'
          updateVideoFromTimeHandle={updateVideoFromTimeHandle}
        />
        <TrimmingSliderTicks />
      </div>
    </div>
  );
};

export default VideoTrimmingSlider;
