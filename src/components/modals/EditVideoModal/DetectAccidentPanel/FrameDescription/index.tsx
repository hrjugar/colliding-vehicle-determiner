import FrameDetections from './FrameDetections';
import useDetectAccidentPanelStore from '../store';
import { useShallow } from 'zustand/react/shallow';

const FrameDescription: React.FC = () => {
  const [
    selectedFrameIndex,
    setSelectedFrameIndex,
    getFrameCount
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.selectedFrameIndex,
      state.setSelectedFrameIndex,
      state.getFrameCount
    ])
  )

  const frameCount = getFrameCount();
  const isPrevButtonDisabled = selectedFrameIndex === 0;
  const isNextButtonDisabled = selectedFrameIndex + 1 >= frameCount;

  return (
    <div className='h-full flex flex-col card'>
      <div className='card-header'>
        <h2>Frame</h2>
      </div>

      <div className='h-full px-4 py-2 flex flex-col gap-2 overflow-y-auto'>
        {/* <div className='flex flex-row justify-between items-center'>
          <p className='font-semibold'>Video frame:</p>
          <p>{selectedFrameIndex + 1}</p>
        </div>
        <p className='font-semibold'>Detections:</p> */}
        <FrameDetections />
        
        <div className='flex flex-row w-full justify-center items-center text-sm pt-2'>
          <button 
            className={`group bg-transparent`}
            disabled={isPrevButtonDisabled}
            onClick={() => setSelectedFrameIndex(selectedFrameIndex - 1)}
          >
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="w-2.5 h-2.5 text-transparent"
            >
              <path 
                d="M48 0 L16 32 L48 64"
                className={`fill-current stroke-[8] stroke-color-primary ${isPrevButtonDisabled ? 'opacity-30' : 'group-hover:stroke-[16] group-hover:stroke-color-primary-inactive'}`}
              />
            </svg>
          </button>

          <p className='text-gray-500'>{selectedFrameIndex + 1}/{frameCount}</p>

          <button 
            className={`group bg-transparent`}
            onClick={() => setSelectedFrameIndex(selectedFrameIndex + 1)}
            disabled={isNextButtonDisabled}
          >
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="w-2.5 h-2.5 text-transparent"
            >
              <path 
                d="M16 0 L48 32 L16 64"
                className={`fill-current stroke-[8] stroke-color-primary ${isNextButtonDisabled ? 'opacity-30' : 'group-hover:stroke-[16] group-hover:stroke-color-primary-inactive'}`}
              />
            </svg>
          </button>              
        </div>
      </div>
    </div>
  );
};

export default FrameDescription;
