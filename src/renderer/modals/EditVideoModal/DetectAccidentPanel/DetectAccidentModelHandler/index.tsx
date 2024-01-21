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
    <div className='flex flex-col card'>
      <div className='card-header'>
        <h2>Model</h2>
        <button 
          type='button'
          onClick={rerunModel}
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
