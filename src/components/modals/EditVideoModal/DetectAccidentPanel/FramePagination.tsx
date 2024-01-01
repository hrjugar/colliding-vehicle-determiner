import React, { useEffect, useRef, useState } from 'react';

interface FramePaginationProps {
  frameCount: number,
}

interface ImageSizeState {
  width: number,
  height: number
}

const FramePagination: React.FC<FramePaginationProps> = ({ frameCount }) => {
  const [imageSize, setImageSize] = useState<ImageSizeState>({ width: 0, height: 0 });

  const [rowFirstImageIndex, setRowFirstImageIndex] = useState<number>(0);
  const [maxImagesPerRow, setMaxImagesPerRow] = useState<number>(10);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const rowLastImageIndex = Math.min(frameCount, rowFirstImageIndex + maxImagesPerRow);
  const currImagesPerRow = rowLastImageIndex - rowFirstImageIndex;

  const isPrevButtonDisabled = rowFirstImageIndex == 0;
  const isNextButtonDisabled = rowFirstImageIndex + currImagesPerRow >= frameCount;

  const handlePrevious = () => {
    const newRowFirstElementIndex = Math.max(0, rowFirstImageIndex - maxImagesPerRow);
    setRowFirstImageIndex(newRowFirstElementIndex);
  };

  const handleNext = () => {
    if (rowFirstImageIndex + currImagesPerRow >= frameCount) {
      return;
    }

    const newRowFirstElementIndex = rowFirstImageIndex + maxImagesPerRow;
    setRowFirstImageIndex(newRowFirstElementIndex);
  }

  useEffect(() => {
    console.log("Inside first use effect");
    const img = new Image();
    img.onload = () => {
      console.log("Set image size!")
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.src = `fileHandler://tempFrame//1`;
  }, []);

  useEffect(() => {
    if (imageSize.width == 0 || imageSize.height == 0) return;
    
    console.log("Running second use effect");
    console.log("Image size is: ", imageSize);

    const calculateImagesPerPage = () => {
      const gapSize = 8;
      const containerWidth = imageContainerRef.current?.offsetWidth || 0;
      const containerHeight = imageContainerRef.current?.offsetHeight || 0;

      const adjustedWidth = (containerHeight / imageSize.height) * imageSize.width;
      setMaxImagesPerRow(Math.floor(containerWidth / (adjustedWidth + gapSize)));
    };

    calculateImagesPerPage();
    window.addEventListener('resize', calculateImagesPerPage);

    return () => {
      window.removeEventListener('resize', calculateImagesPerPage);
    }
  }, [imageSize]);
  
  return (
    <div className='w-full flex flex-col items-center gap-2'>
      <div className='w-full flex flex-row justify-between px-4'>
        <h2>Frames <span>{rowFirstImageIndex + 1}-{rowLastImageIndex}</span> of <span>{frameCount}</span></h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-color-primary" />
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hide frames without detection</span>
        </label>
      </div>
      <div className='w-full flex flex-row items-center gap-1'>
        <button 
          className={`group p-2 rounded-full bg-transparent ${isPrevButtonDisabled ? '' : 'hover:bg-color-primary-active'}`}
          onClick={() => handlePrevious()}
          disabled={isPrevButtonDisabled}
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-transparent"
          >
            <path 
              d="M48 0 L16 32 L48 64"
              className={`fill-current stroke-[6] stroke-color-primary ${isPrevButtonDisabled ? 'opacity-30' : 'group-hover:stroke-black'}`}
            />
          </svg>
        </button>

        <div 
          className='w-full flex flex-row flex-nowrap justify-center h-20 gap-[8px] overflow-hidden'
          ref={imageContainerRef}
        >
          {Array(currImagesPerRow).fill(null).map((_, index) => (
            <img 
              key={`frame-pagination-${index}`}
              className='w-auto h-full grow-0 shrink-0'
              src={`fileHandler://tempFrame//${rowFirstImageIndex + index + 1}`}
            />
            // <div 
            //   key={`frame-pagination-${index}`} 
            //   className='w-auto h-full grow-0 shrink-0'
            //   style={{ backgroundColor: images[rowFirstImageIndex + index] }}
            // />
          ))}
        </div>

        <button 
          className={`group p-2 rounded-full bg-transparent ${isNextButtonDisabled ? '' : 'hover:bg-color-primary-active'}`}
          onClick={() => handleNext()}
          disabled={isNextButtonDisabled}
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-transparent"
          >
            <path 
              d="M16 0 L48 32 L16 64"
              className={`fill-current stroke-[6] stroke-color-primary ${isNextButtonDisabled ? 'opacity-30' : 'group-hover:stroke-black'}`}
            />
          </svg>
        </button>        
      </div>
    </div>
  );
};

export default FramePagination;
