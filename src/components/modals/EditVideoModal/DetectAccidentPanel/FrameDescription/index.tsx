import FrameDetections from './FrameDetections';
import { hiddenPredictionIndexesAction } from '..';
import { FramePrediction } from '../types';

interface FrameDescriptionProps {
  prediction: FramePrediction,
  selectedFrame: number,
  bestPrediction: { frame: number, box: number }
  hiddenPredictionIndexes: Set<number>,
  dispatchHiddenPredictionIndexes: React.Dispatch<hiddenPredictionIndexesAction>,
  isFrameTransitionDone: boolean,
}

const FrameDescription: React.FC<FrameDescriptionProps> = ({ 
  prediction, 
  selectedFrame,
  bestPrediction,
  hiddenPredictionIndexes,
  dispatchHiddenPredictionIndexes,
  isFrameTransitionDone
}) => {
  return (
    <div className='h-full flex flex-col bg-white rounded-sm shadow-around hover:shadow-around-dark transition-shadow'>
      <div className='w-full flex flex-row justify-between items-center border-b-[1px] border-gray-300 px-4 py-2'>
        <h2 className='font-semibold text-lg'>Frame</h2>
      </div>

      <div className='h-full px-4 pt-2 pb-4 flex flex-col gap-2 text-sm overflow-y-auto '>
        <div className='flex flex-row justify-between items-center'>
          <p className='font-semibold'>Video frame:</p>
          <p>{selectedFrame + 1}</p>
        </div>
        <p className='font-semibold'>Detections:</p>
        <FrameDetections 
          prediction={prediction} 
          selectedFrame={selectedFrame}
          bestPrediction={bestPrediction}
          hiddenPredictionIndexes={hiddenPredictionIndexes}
          dispatchHiddenPredictionIndexes={dispatchHiddenPredictionIndexes}
          isFrameTransitionDone={isFrameTransitionDone}
        />
      </div>
    </div>
  );
};

export default FrameDescription;
