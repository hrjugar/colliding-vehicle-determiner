import React, { useEffect, useRef, useState } from 'react';

const randomColors = Array(20).fill(null).map((_, index) => {
  const redValue = Math.floor((255 / 19) * index);
  return `rgb(${redValue}, 0, 0)`;
});

interface FramePaginationProps {
  // Add any props you need for the component
}

const FramePagination: React.FC<FramePaginationProps> = ({ }) => {
  const images = randomColors;

  const [rowFirstElementIndex, setRowFirstElementIndex] = useState<number>(0);
  const [imagePerRow, setImagePerRow] = useState<number>(10);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    const newRowFirstElementIndex = Math.max(0, rowFirstElementIndex - imagePerRow);
    setRowFirstElementIndex(newRowFirstElementIndex);
  };

  const handleNext = () => {
    const newRowFirstElementIndex = Math.min(images.length - imagePerRow, rowFirstElementIndex + imagePerRow);
    setRowFirstElementIndex(newRowFirstElementIndex);
  }

  useEffect(() => {
    const calculateImagesPerPage = () => {
      const imageWidth = 128; // 8 rem = 128px
      const gapSize = 8;
      const containerWidth = imageContainerRef.current?.offsetWidth || 0;
      setImagePerRow(Math.floor(containerWidth / (imageWidth + gapSize)));
    };

    calculateImagesPerPage();
    window.addEventListener('resize', calculateImagesPerPage);

    return () => {
      window.removeEventListener('resize', calculateImagesPerPage);
    }
  }, []);
  
  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='w-full flex flex-row justify-between'>
        <p>Frames <span>{rowFirstElementIndex + 1}-{rowFirstElementIndex + imagePerRow}</span> of <span>{images.length}</span></p>
        <p>Hide frames without detections</p>
      </div>
      <div className='w-full flex flex-row items-center gap-2'>
        <button 
          className="group p-2 rounded-full bg-transparent hover:bg-color-primary-active"
          onClick={() => handlePrevious()}
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
              className="fill-current stroke-[6] stroke-color-primary group-hover:stroke-black"
            />
          </svg>
        </button>

        <div 
          className='w-full flex flex-row flex-nowrap justify-center h-20 gap-[8px] overflow-hidden'
          ref={imageContainerRef}
        >
          {Array(imagePerRow).fill(null).map((_, index) => (
            <div 
              key={`frame-pagination-${index}`} 
              className='basis-[128px] grow-0 shrink-0'
              style={{ backgroundColor: images[rowFirstElementIndex + index] }}
            />
          ))}
        </div>

        <button 
          className="group p-2 rounded-full bg-transparent hover:bg-color-primary-active"
          onClick={() => handleNext()}
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
              className="fill-current stroke-[6] stroke-color-primary group-hover:stroke-black"
            />
          </svg>
        </button>        
      </div>
    </div>
  );
};

export default FramePagination;
