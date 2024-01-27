import { FramePagination } from "@/renderer/components/FramePagination"
import useAccidentDetectionPanelStore from "./store"
import { useShallow } from "zustand/react/shallow"
import { useLoaderData } from "react-router-dom"

const AccidentDetectionFramePagination: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const [
    selectedFrameIndex,
    setSelectedFrameIndex,
    allPredictions,
  ] = useAccidentDetectionPanelStore(
    useShallow((state) => [
      state.selectedFrameIndex,
      state.setSelectedFrameIndex,
      state.allPredictions,
    ])
  )

  const renderFrameLabel = (framePredictions: BoundingBoxWithConfidence[]) => (
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
      imgSrcPrefix={`fileHandler://frame//${video.id}//`}
    />
  );
}

export default AccidentDetectionFramePagination;