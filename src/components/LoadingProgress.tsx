import React from 'react';

interface LoadingProgressProps {
  loadingText: string,
  loadingProgress: Progress,
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ 
  loadingText,
  loadingProgress,
}) => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-2 px-4'>
      <div className='w-full flex flex-row justify-between gap-1'>
        <p className='font-medium'>{loadingText}</p>
        <p className='font-medium text-gray-400'>{loadingProgress.displayText}</p>
      </div>
      
      <div className="w-full bg-gray-300 rounded-full">
        <div className="bg-color-primary rounded-full h-2 transition-width duration-300" style={{ width: `${loadingProgress.percent}%` }}></div>
      </div>
    </div>    
  );
};

export default LoadingProgress;
