import { useShallow } from 'zustand/react/shallow';
import useDetectAccidentPanelStore from '../store';
import { getBoundingBoxColor } from '@/globals/utils';
import { useEffect, useState } from 'react';

interface SelectedFrameImageProps {
  imageSideCardsDivRef: React.RefObject<HTMLDivElement>;
}

const SelectedFrameImage: React.FC<SelectedFrameImageProps> = ({ imageSideCardsDivRef }) => {
  const [
    selectedFrameIndex,
    getSelectedFramePredictions,
    isFrameTransitionDone,
    hiddenPredictionBoxIndexes,
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.selectedFrameIndex,
      state.getSelectedFramePredictions,
      state.isFrameTransitionDone,
      state.hiddenPredictionBoxIndexes,
    ])
  )

  const framePredictions = getSelectedFramePredictions();

  const [selectedFrameImageHeight, setSelectedFrameImageHeight] = useState<number>(0);

  const updateHeight = () => {
    if (imageSideCardsDivRef.current) {
      const height = imageSideCardsDivRef.current.offsetHeight;
      setSelectedFrameImageHeight(height);
    }
  }

  useEffect(() => {
    updateHeight();
    const resizeObserver = new ResizeObserver(() => updateHeight());
    if (imageSideCardsDivRef.current) {
      resizeObserver.observe(imageSideCardsDivRef.current);
    }

    return () => {
      if (imageSideCardsDivRef.current) {
        resizeObserver.unobserve(imageSideCardsDivRef.current);

      }
    }
  }, [imageSideCardsDivRef]);

  return (
    <div 
      className='flex-shrink w-full h-full bg-black flex justify-center items-center shadow-around'
      style={{ maxHeight: `${selectedFrameImageHeight}px` }}
    >
      <div className='relative inline-block h-full'>
        <img
          src={`fileHandler://tempFrame//${selectedFrameIndex + 1}`}
          className='object-contain h-full'
        />
        
        {framePredictions && framePredictions.length > 0 ? (
          framePredictions.map((item, index) => {
            if (hiddenPredictionBoxIndexes.has(index)) {
              return null;
            }

            return (
              <div 
                key={`prediction-${selectedFrameIndex}-${index}`}
                className={`absolute border-2 border-primary ${isFrameTransitionDone ? 'animate-scale-up' : ''}`}
                style={{
                  borderColor: getBoundingBoxColor(index),
                  left: `${(item.xn - item.wn / 2) * 100}%`,
                  top: `${(item.yn - item.hn / 2) * 100}%`,
                  width: `${(item.wn) * 100}%`,
                  height: `${(item.hn) * 100}%`,
                  zIndex: Math.round(item.confidence * 100),
                  transformOrigin: 'top left',
                }}
              />
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default SelectedFrameImage;
