import { useLoaderData } from "react-router-dom";

const ModelDetails: React.FC = () => {
  const video = useLoaderData() as VideoData;

  return (
    <div className="card">
      <div className="card-header">
        <h2>Model</h2>
      </div>

      <div className="grid grid-cols-[auto,auto] gap-x-4 px-4 py-2 text-sm whitespace-nowrap">
        <p className="place-self-start">Confidence Threshold</p>
        <p className="place-self-end">{video.accidentModelConfidenceThreshold}%</p>
        <p className="place-self-start">IoU Threshold</p>
        <p className="place-self-end">{video.accidentModelIOUThreshold}%</p>
      </div>
    </div>
  )
}

export default ModelDetails;