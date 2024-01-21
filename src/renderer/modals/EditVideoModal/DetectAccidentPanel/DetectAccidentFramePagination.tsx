import { useShallow } from "zustand/react/shallow";
import { FramePagination } from "@/components/FramePagination";
import useDetectAccidentPanelStore from "./store";
import { FramePredictions } from "./types";

const DetectAccidentFramePagination: React.FC = () => {
  const [
    selectedFrameIndex,
    setSelectedFrameIndex,
    allPredictions,
  ] = useDetectAccidentPanelStore(
    useShallow((state) => [
      state.selectedFrameIndex,
      state.setSelectedFrameIndex,
      state.allPredictions
    ])
  );

  const renderFrameLabel = (framePredictions: FramePredictions) => (
    <div className='absolute bottom-1 right-1 text-xs font-semibold py-1 px-2 h-6 rounded-full flex items-center justify-center bg-white'>
      <p>{framePredictions.length} <span className='hidden group-hover:contents'>collision{framePredictions.length === 1 ? '' : 's'}</span></p>
    </div>
  );

  return (
    <FramePagination 
      selectedFrameIndex={selectedFrameIndex}
      setSelectedFrameIndex={setSelectedFrameIndex}
      frameList={allPredictions}
      renderFrameLabel={renderFrameLabel}
      imgSrcPrefix={`fileHandler://tempFrame//`}
    />
  );
};

export default DetectAccidentFramePagination;
