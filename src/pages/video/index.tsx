import Breadcrumbs from "@/components/Breadcrumbs";
import { useMatch, useMatches } from "react-router-dom";

const VideoPage: React.FC = () => {
  const match = useMatch("/video/:id");
  console.log(match);

  return (
    <div className="page">
      <Breadcrumbs />
    </div>
  );
};

export default VideoPage;
