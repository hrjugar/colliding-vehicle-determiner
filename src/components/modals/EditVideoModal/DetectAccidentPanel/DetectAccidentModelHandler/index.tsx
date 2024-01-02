import React from 'react';
import ThresholdHandler from './ThresholdHandler';

interface DetectAccidentModelHandlerProps {
  confidenceThreshold: number,
  setConfidenceThreshold: (confidenceThreshold: number) => void,
  iouThreshold: number,
  setIouThreshold: (iouThreshold: number) => void,
}

const DetectAccidentModelHandler: React.FC<DetectAccidentModelHandlerProps> = ({ 
  confidenceThreshold,
  setConfidenceThreshold,
  iouThreshold,
  setIouThreshold
}) => {

  return (
    <div className='flex flex-col bg-gray-100 border-[1px] border-color-primary px-6 py-4 rounded-sm gap-8'>
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

      <button 
        className='text-white bg-color-primary px-3 py-2 text-xs self-end rounded-sm'
      >Rerun Model</button>
    </div>
  );
};

export default DetectAccidentModelHandler;
