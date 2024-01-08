import { useShallow } from 'zustand/react/shallow';
import useDetectAccidentPanelStore from '../store';
import { getBoundingBoxColor } from '@/globals/utils';


const SelectedFrameImage: React.FC = () => {
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

  return (
    <div className='bg-black flex justify-center items-center w-full shadow-around'>
      <div className='relative inline-block'>
        <img
          src={`fileHandler://tempFrame//${selectedFrameIndex + 1}`}
          className='object-contain'
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
