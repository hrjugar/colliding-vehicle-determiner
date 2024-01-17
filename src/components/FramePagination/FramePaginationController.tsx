interface FramePaginationControllerProps {
  rowFirstImageIndex: number,
  setRowFirstImageIndex: (index: number) => void,
  maxImagesPerRow: number,
  currImagesPerRow: number,
  frameCount: number,
  maxPageButtonsShown: number
}

const FramePaginationController: React.FC<FramePaginationControllerProps> = ({
  rowFirstImageIndex,
  setRowFirstImageIndex,
  maxImagesPerRow,
  currImagesPerRow,
  frameCount,
  maxPageButtonsShown
}) => {
  const pageCount = maxImagesPerRow === 0 ? 0 : Math.ceil(frameCount / maxImagesPerRow);
  const currPage = Math.floor(rowFirstImageIndex / maxImagesPerRow) + 1;

  const isPrevButtonDisabled = rowFirstImageIndex === 0;
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

  const renderPageButtons = () => {
    const buttonsToShow = maxPageButtonsShown;
    const buttonsPerSide = Math.floor(buttonsToShow / 2);
    const startPage = Math.max(1, currPage - buttonsPerSide);
    const endPage = Math.min(pageCount, startPage + buttonsToShow - 1);

    const pageButtons = [];
        
    const ellipsisElement = (keyName: string) => {
      return (
        <span key={`ellipsis-${keyName}`} className='px-3'>...</span>
      )
    };

    const buttonElement = (pageNumber: number) => {
      return (
        <button 
          key={`frame-pagination-button-${pageNumber}`} 
          onClick={() => handlePageClick(pageNumber)}
          className={`flex items-center justify-center p-3 w-4 h-4 rounded-full transition-colors ${
            currPage == pageNumber ? 'bg-color-primary text-white' : 
            'bg-white text-color-primary hover:bg-color-primary-active hover:text-color-primary'
          }`}
        >{pageNumber}</button>
      )
    };

    if (startPage > 1) {
      pageButtons.push(
        buttonElement(1),
        ellipsisElement('start')
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        buttonElement(i)
      );
    }

    if (endPage < pageCount) {
      pageButtons.push(
        ellipsisElement('end'),
        buttonElement(pageCount)
      );
    }

    return pageButtons;
  };

  const handlePageClick = (page: number) => {
    const newRowFirstElementIndex = (page - 1) * maxImagesPerRow;
    setRowFirstImageIndex(newRowFirstElementIndex);
  };

  return (
    <div className='px-4'>
      <div className='flex flex-row w-full font-medium text-sm py-1.5 text-color-primary justify-between items-center'>
        <button 
            className={`group px-4 bg-transparent`}
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
                className={`fill-current stroke-[8] stroke-color-primary ${isPrevButtonDisabled ? 'opacity-30' : 'group-hover:stroke-[12] group-hover:stroke-color-primary-inactive'}`}
              />
            </svg>
          </button>  

          <div className='flex flex-row items-center gap-2'>
            {renderPageButtons()}
          </div>
          
          <button 
            className={`group px-4 bg-transparent`}
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
                className={`fill-current stroke-[8] stroke-color-primary ${isNextButtonDisabled ? 'opacity-30' : 'group-hover:stroke-[12] group-hover:stroke-color-primary-inactive'}`}
              />
            </svg>
          </button>     
      </div>  
    </div>
  );
};

export default FramePaginationController;
