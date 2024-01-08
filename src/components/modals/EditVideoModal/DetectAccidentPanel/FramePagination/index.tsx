import { useEffect, useRef, useState } from 'react';
import FramePaginationController from './FramePaginationController';
import useDetectAccidentPanelStore from '../store';
import { useShallow } from 'zustand/react/shallow';

interface ImageSizeState {
  width: number,
  height: number
}

const FramePagination: React.FC = () => {
  const [
    selectedFrameIndex,
    setSelectedFrameIndex,
    allPredictions,
    getFrameCount
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.selectedFrameIndex,
      state.setSelectedFrameIndex,
      state.allPredictions,
      state.getFrameCount
    ])
  );

  const frameCount = getFrameCount();

  const [imageSize, setImageSize] = useState<ImageSizeState>({ width: 0, height: 0 });

  const [rowFirstImageIndex, setRowFirstImageIndex] = useState<number>(0);
  const [maxImagesPerRow, setMaxImagesPerRow] = useState<number>(10);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const rowLastImageIndex = Math.min(frameCount, rowFirstImageIndex + maxImagesPerRow);
  const currImagesPerRow = rowLastImageIndex - rowFirstImageIndex;

  const goToSelectedFramePage = () => {
    const selectedFramePage = Math.floor(selectedFrameIndex / maxImagesPerRow);
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
  }, [selectedFrameIndex]);

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
    <div className='w-full flex flex-col items-center card'>
      <div className='card-header'>
        <h2>Frames</h2>
        <button
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
            {Array(currImagesPerRow).fill(null).map((_, index) => {
              const currFrameIndex = rowFirstImageIndex + index;
              const currFramePrediction = allPredictions[currFrameIndex];

              return (
                <div
                  key={`frame-pagination-${index}`}
                  className={`group relative transition-shadow flex justify-center items-center ${selectedFrameIndex === currFrameIndex ? 'shadow-around-dark opacity-100' : ''}`}>
                  <img 
                    className={`w-auto h-full grow-0 shrink-0 cursor-pointer`}
                    src={`fileHandler://tempFrame//${currFrameIndex + 1}`}
                    onClick={() => setSelectedFrameIndex(currFrameIndex)}
                  />

                  <div className={`absolute inset-0 pointer-events-none bg-white transition-opacity ${selectedFrameIndex === currFrameIndex ? 'opacity-50' : 'opacity-0'}`}/>
                  
                  {currFramePrediction ? (
                    <div className='absolute bottom-1 right-1 text-xs font-semibold py-1 px-2 h-6 rounded-full flex items-center justify-center bg-white'>
                      <p>{currFramePrediction.length} <span className='hidden group-hover:contents'>collision{currFramePrediction.length === 1 ? '' : 's'}</span></p>
                    </div>
                  ) : null}
                </div>
              );
            })}
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
