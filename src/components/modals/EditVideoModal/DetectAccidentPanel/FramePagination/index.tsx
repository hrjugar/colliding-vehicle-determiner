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

const FramePagination: React.FC<FramePaginationProps> = ({ frameCount }) => {
  const [imageSize, setImageSize] = useState<ImageSizeState>({ width: 0, height: 0 });

  const [rowFirstImageIndex, setRowFirstImageIndex] = useState<number>(0);
  const [maxImagesPerRow, setMaxImagesPerRow] = useState<number>(10);
  const [shouldHideFramesWithoutDetection, setShouldHideFramesWithoutDetection] = useState<boolean>(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [selectedFrame, setSelectedFrame] = useState<number>(0);

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
      <div className='w-full flex flex-row justify-between'>
        <h2>Frames <span>{rowFirstImageIndex + 1}-{rowLastImageIndex}</span> of <span>{frameCount}</span></h2>
        <button 
          className='p-0 text-sm font-medium hover:text-color-primary-active'
          onClick={goToSelectedFramePage}
        >
          Go to selected frame
        </button>
      </div>
      <div className='w-full flex flex-row items-center'>
        <div 
          className='w-full flex flex-row flex-nowrap justify-center h-20 gap-[8px] overflow-hidden'
          ref={imageContainerRef}
        >
          {Array(currImagesPerRow).fill(null).map((_, index) => (
            <img 
              key={`frame-pagination-${index}`}
              className={`w-auto h-full grow-0 shrink-0 cursor-pointer ${selectedFrame === rowFirstImageIndex + index ? 'border-4 border-color-primary' : ''}`}
              src={`fileHandler://tempFrame//${rowFirstImageIndex + index + 1}`}
              onClick={() => setSelectedFrame(rowFirstImageIndex + index)}
            />
            // <div 
            //   key={`frame-pagination-${index}`} 
            //   className='w-auto h-full grow-0 shrink-0'
            //   style={{ backgroundColor: images[rowFirstImageIndex + index] }}
            // />
          ))}
        </div>      
      </div>
      <FramePaginationController 
        rowFirstImageIndex={rowFirstImageIndex}
        setRowFirstImageIndex={setRowFirstImageIndex}
        maxImagesPerRow={maxImagesPerRow}
        currImagesPerRow={currImagesPerRow}
        frameCount={frameCount}
      />
    </div>
  );
};

export default FramePagination;
