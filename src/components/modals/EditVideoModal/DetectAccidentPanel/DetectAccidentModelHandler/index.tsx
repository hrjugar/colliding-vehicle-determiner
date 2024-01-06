import { useShallow } from 'zustand/react/shallow';
import useDetectAccidentPanelStore from '../store';
import ThresholdHandler from './ThresholdHandler';

interface DetectAccidentModelHandlerProps {
  rerunModel: () => void,
}

const DetectAccidentModelHandler: React.FC<DetectAccidentModelHandlerProps> = ({ 
  rerunModel
}) => {
  const [
    confidenceThreshold,
    setConfidenceThreshold,
    iouThreshold,
    setIouThreshold
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.confidenceThreshold,
      state.setConfidenceThreshold,
      state.iouThreshold,
      state.setIouThreshold,
    ])
  )

  return (
    <div className='flex flex-col bg-white rounded-md shadow-around hover:shadow-around-dark transition-shadow'>
      <div className='w-full flex flex-row justify-between items-center border-b-[1px] border-gray-300 px-4 py-2'>
        <h2 className='font-semibold text-lg'>Model</h2>
        <button 
          type='button'
          onClick={rerunModel}
          className='p-0 text-sm font-medium rounded-sm bg-transparent hover:font-semibold'
        >Rerun</button>
      </div>

      <div className='flex flex-col gap-8 p-4 pb-8'>
        <div className='flex flex-col gap-4'>
          <ThresholdHandler 
            name={'Confidence'} 
            threshold={confidenceThreshold}
            setThreshold={setConfidenceThreshold}
          />

          <ThresholdHandler 
            name={'IoU'} 
            threshold={iouThreshold}
            setThreshold={setIouThreshold}
          />
        </div>
      </div>
    </div>
  );
};

export default DetectAccidentModelHandler;
