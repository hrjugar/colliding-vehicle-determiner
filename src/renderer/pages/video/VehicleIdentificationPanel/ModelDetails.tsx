import { useLoaderData } from "react-router-dom";

const ModelDetails: React.FC = () => {
  const video = useLoaderData() as VideoData;

  return (
    <div className="card">
      <div className="card-header">
        <h2>Model</h2>
      </div>

      <div className="flex flex-row items-center justify-between px-4 py-2 text-sm whitespace-nowrap">
        <p className="place-self-start">YOLO Model</p>
        <p className="place-self-end">{video.deepSORTModel}</p>
      </div>
    </div>
  )
}

export default ModelDetails;