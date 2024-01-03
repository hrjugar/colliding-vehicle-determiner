import React, { useEffect, useRef, useState } from 'react';
import FramePaginationController from './FramePaginationController';

interface FramePaginationProps {
  frameCount: number,
  selectedFrame: number,
  setSelectedFrame: (frame: number) => void
}

interface ImageSizeState {
  width: number,
  height: number
}

const FramePagination: React.FC<FramePaginationProps> = ({ frameCount, selectedFrame, setSelectedFrame }) => {
  const [imageSize, setImageSize] = useState<ImageSizeState>({ width: 0, height: 0 });

  const [rowFirstImageIndex, setRowFirstImageIndex] = useState<number>(0);
  const [maxImagesPerRow, setMaxImagesPerRow] = useState<number>(10);
  const [shouldHideFramesWithoutDetection, setShouldHideFramesWithoutDetection] = useState<boolean>(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const rowLastImageIndex = Math.min(frameCount, rowFirstImageIndex + maxImagesPerRow);
  const currImagesPerRow = rowLastImageIndex - rowFirstImageIndex;

  const goToSelectedFramePage = () => {
    const selectedFramePage = Math.floor(selectedFrame / maxImagesPerRow);
    const newFirstImageIndex = selectedFramePage * maxImagesPerRow;
    setRowFirstImageIndex(newFirstImageIndex);
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
    goToSelectedFramePage();
  }, [selectedFrame]);

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
    <div className='w-full flex flex-col items-center bg-white shadow-around hover:shadow-around-dark transition-shadow rounded-md'>
      <div className='w-full flex flex-row justify-between items-center border-b-[1px] border-gray-300 px-4 py-2'>
        <h2 className='font-semibold text-lg'>Frames</h2>
        <button 
          className='p-0 text-sm font-medium bg-transparent hover:font-semibold'
          onClick={goToSelectedFramePage}
        >
          Go to selected frame
        </button>
      </div>
      <div className='w-full p-4 pb-2 flex flex-col items-center gap-2'>
        <div className='w-full flex flex-row items-center'>
          <div 
            className='w-full flex flex-row flex-nowrap justify-center h-20 gap-[8px]'
            ref={imageContainerRef}
          >
            {Array(currImagesPerRow).fill(null).map((_, index) => (
              <div
                key={`frame-pagination-${index}`}
                className={`relative transition-shadow ${selectedFrame === rowFirstImageIndex + index ? 'shadow-around-dark opacity-100' : ''}`}>
                <img 
                  className={`w-auto h-full grow-0 shrink-0 cursor-pointer`}
                  src={`fileHandler://tempFrame//${rowFirstImageIndex + index + 1}`}
                  onClick={() => setSelectedFrame(rowFirstImageIndex + index)}
                />

                <div className={`absolute inset-0 pointer-events-none bg-white transition-opacity ${selectedFrame === rowFirstImageIndex + index ? 'opacity-50' : 'opacity-0'}`}/>
              </div>
            ))}
          </div>      
        </div>

        <div className='relative w-full flex flex-row justify-center items-center'>
          <FramePaginationController 
            rowFirstImageIndex={rowFirstImageIndex}
            setRowFirstImageIndex={setRowFirstImageIndex}
            maxImagesPerRow={maxImagesPerRow}
            currImagesPerRow={currImagesPerRow}
            frameCount={frameCount}
          />     
          <p className='absolute right-0 text-sm'><span>{rowFirstImageIndex + 1} to {rowLastImageIndex}</span> of <span>{frameCount}</span></p>
        </div>
      </div>
    </div>
  );
};

export default FramePagination;
