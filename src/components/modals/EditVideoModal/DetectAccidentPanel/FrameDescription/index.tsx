import FrameDetections from './FrameDetections';
import useDetectAccidentPanelStore from '../store';

const FrameDescription: React.FC = () => {
  const selectedFrameIndex = useDetectAccidentPanelStore((state) => state.selectedFrameIndex);
  return (
    <div className='h-full flex flex-col card'>
      <div className='card-header'>
        <h2>Frame</h2>
      </div>

      <div className='h-full px-4 pt-2 pb-4 flex flex-col gap-2 text-sm overflow-y-auto '>
        <div className='flex flex-row justify-between items-center'>
          <p className='font-semibold'>Video frame:</p>
          <p>{selectedFrameIndex + 1}</p>
        </div>
        <p className='font-semibold'>Detections:</p>
        <FrameDetections />
      </div>
    </div>
  );
};

export default FrameDescription;
