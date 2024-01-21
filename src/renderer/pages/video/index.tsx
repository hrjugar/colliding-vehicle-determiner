import { getFileNameFromPath } from "@renderer/globals/utils";
import PageHeader from "@renderer/components/PageHeader";
import { useLoaderData, useNavigate } from "react-router-dom";
import VideoPlayerSection from "./VideoPlayerSection";

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const video = useLoaderData() as Video;

  return (
    <div className="page pr-6">
      <PageHeader 
        title="Videos"
        breadcrumbs={[
          (
            <p
              className="cursor-pointer hover:font-medium" 
              onClick={() => navigate("..")}
            >
              Home
            </p>
          ),
          (
            <p>{getFileNameFromPath(video.path)}</p>
          )
        ]}
      />

      <VideoPlayerSection 
        id={video.id}
        // fps={video.fps}
        fps={30}
      />
    </div>
  );
};

export default VideoPage;
