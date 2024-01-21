import { getFileNameFromPath } from "@renderer/globals/utils";
import PageHeader from "@renderer/components/PageHeader";
import { useLoaderData, useNavigate } from "react-router-dom";

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const video = useLoaderData() as Video;

  return (
    <div className="page">
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
    </div>
  );
};

export default VideoPage;
