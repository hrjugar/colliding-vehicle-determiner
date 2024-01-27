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
    <div className='flex flex-col card flex-grow'>
      <div className='card-header'>
        <h2>Frame</h2>
      </div>

      <FrameDetections />

      <div className='flex flex-row w-full justify-center items-center text-sm p-1 border-t-[1px] border-gray-300 mt-auto'>
        <button 
          className="group bg-transparent px-4 py-2"
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
          className="group bg-transparent px-4 py-2"
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
  );
};

export default FrameDescription;
