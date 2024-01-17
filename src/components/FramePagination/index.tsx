import React, { useEffect, useState } from 'react';
import { ImageSizeState } from './types';
import FramePaginationController from './FramePaginationController';

export interface FramePaginationProps {
  imgSrcPrefix: string;
  frameList: number[];
  selectFrameCallback: (selectedFrame: number) => void;
  cardTitle?: string;
  maxPageButtonsShown?: number;
}

// TODO: Use this for DetectAccidentPanel too.
export const FramePagination: React.FC<FramePaginationProps> = ({
  imgSrcPrefix, 
  frameList,
  selectFrameCallback,
  cardTitle = 'Frames',
  maxPageButtonsShown = 5
}) => {
  const frameCount = frameList.length;
  const [originalFrameSize, setOriginalFrameSize] = React.useState<ImageSizeState>({ width: 0, height: 0 });

  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(-1);

  const [rowFirstFrameIndex, setRowFirstFrameIndex] = useState<number>(0);
  const [maxFramesPerRow, setMaxFramesPerRow] = useState<number>(1);
  const frameListRef = React.useRef<HTMLDivElement>(null);

  const rowLastFrameIndex = Math.min(frameCount, rowFirstFrameIndex + maxFramesPerRow);
  const currFramesPerRow = Math.max(0, rowLastFrameIndex - rowFirstFrameIndex);

  const goToSelectedFramePage = () => {
    if (frameList.length === 0 || selectedFrameIndex === -1) return;

    const selectedFramePage = Math.floor(selectedFrameIndex / maxFramesPerRow);
    const newFirstFrameIndex = selectedFramePage * maxFramesPerRow;
    setRowFirstFrameIndex(newFirstFrameIndex);
  };

  useEffect(() => {
    if (frameList.length === 0) return;

    setSelectedFrameIndex(-1);
    setRowFirstFrameIndex(0);
    setMaxFramesPerRow(1);

    console.log("Inside first use effect");
    const img = new Image();
    img.onload = () => {
      console.log("Set image size!");
      setOriginalFrameSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = `${imgSrcPrefix}${frameList[0]}`;
  }, [frameList]);

  useEffect(() => {
    goToSelectedFramePage();
  }, [selectedFrameIndex]);

  useEffect(() => {
    if (originalFrameSize.width == 0 || originalFrameSize.height == 0) return;

    console.log("Running second use effect");
    console.log("Image size is: ", originalFrameSize);

    const calculateFramesPerPage = () => {
      const gapSize = 8;
      const containerWidth = frameListRef.current?.offsetWidth || 0;
      const displayedFrameHeight = 80; // h-20

      const adjustedWidth = (displayedFrameHeight / originalFrameSize.height) * originalFrameSize.width;
      setMaxFramesPerRow(Math.floor(containerWidth / (adjustedWidth + gapSize)));
    };

    calculateFramesPerPage();
    
    const resizeObserver = new ResizeObserver(() => calculateFramesPerPage());
    if (frameListRef.current) {
      resizeObserver.observe(frameListRef.current);
    }

    return () => {
      if (frameListRef.current) {
        resizeObserver.unobserve(frameListRef.current);
      }
    };
  }, [originalFrameSize]);

  return (
    <div className='w-full flex flex-col items-center card'>
      <div className='card-header'>
        <h2>{cardTitle}</h2>
        <button
          onClick={goToSelectedFramePage}
        >
          Go to selected frame
        </button>
      </div>
      <div className='w-full p-4 pb-2 flex flex-col items-center justify-between gap-2 h-full '>
        <div className='w-full flex flex-row items-center'>
          <div 
            className='w-full flex flex-row flex-nowrap justify-center h-24 gap-[8px] '
            ref={frameListRef}
          >
            {frameList.length === 0 ? (
              <p className='self-center'>No frames</p>
            ) : (
              Array(currFramesPerRow).fill(null).map((_, index) => {
                const currFrameIndex = rowFirstFrameIndex + index;
                const currFrame = frameList[currFrameIndex];
                // const currFramePrediction = frameList[currFrameIndex];
  
                return (
                  <div
                    key={`frame-pagination-${index}`}
                    className={`group flex-col justify-start items-center`}>
                    <p className={`text-xs ${selectedFrameIndex === currFrameIndex ? 'font-semibold' : 'group-hover:font-medium'}`}>Frame {currFrame}</p>
                    <div className={`group-hover:shadow-around relative h-20 flex flex-col justify-center items-center`}>
                      <img 
                        className={`w-auto h-full grow-0 shrink-0 cursor-pointer`}
                        src={`${imgSrcPrefix}${currFrame}`}
                        onClick={() => {
                          selectFrameCallback(currFrame);
                          setSelectedFrameIndex(currFrameIndex)
                        }}
                      />
    
                      <div className={`absolute h-20 inset-0 pointer-events-none transition-all duration-75 ${selectedFrameIndex === currFrameIndex ? 'bg-white/25 border-2 border-color-primary' : 'bg-transparent group-hover:bg-white/10'}`}/>
                    </div>

                    
                    {/* {currFramePrediction ? (
                      <div className='absolute bottom-1 right-1 text-xs font-semibold py-1 px-2 h-6 rounded-full flex items-center justify-center bg-white'>
                        <p>{currFramePrediction.length} <span className='hidden group-hover:contents'>collision{currFramePrediction.length === 1 ? '' : 's'}</span></p>
                      </div>
                    ) : null} */}
                  </div>
                );
              })
            )}
          </div>      
        </div>

        {frameList.length > 0 ? (
          <div className='relative w-full flex flex-row justify-center items-center'>
            <FramePaginationController 
              rowFirstImageIndex={rowFirstFrameIndex}
              setRowFirstImageIndex={setRowFirstFrameIndex}
              maxImagesPerRow={maxFramesPerRow}
              currImagesPerRow={currFramesPerRow}
              frameCount={frameCount}
              maxPageButtonsShown={maxPageButtonsShown}
            />     
            <p className='absolute right-0 text-sm'><span>{rowFirstFrameIndex + 1} to {rowLastFrameIndex}</span> of <span>{frameCount}</span></p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
