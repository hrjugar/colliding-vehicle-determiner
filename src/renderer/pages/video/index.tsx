import { getFileNameFromPath } from "@renderer/globals/utils";
import PageHeader from "@renderer/components/PageHeader";
import { useLoaderData, useNavigate } from "react-router-dom";
import VideoPlayerSection from "./VideoPlayerSection";
import FrameSection from "./FrameSection";

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const video = useLoaderData() as VideoData;

  console.log(video);

  return (
    <div className="page flex flex-col gap-6">
      <div className="no-drag flex flex-col items-start">
        <div 
          className="group px-3 py-1.5 -translate-x-2 rounded-full group flex flex-row items-center gap-2 cursor-pointer transition-colors hover:bg-gray-300"
          onClick={() => navigate("..")}
        >
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 cursor-pointer"
            >
              <path 
                d="M53.3333 29.3333V34.6667H21.3333L36 49.3333L32.2133 53.12L11.0933 32L32.2133 10.88L36 14.6667L21.3333 29.3333H53.3333Z"
                className="fill-current"
              />
            </svg>
            <p>Back</p>
        </div>
        <h1 className="text-2xl font-medium">Results - {getFileNameFromPath(video.path)}</h1>
      </div>

      <div className="w-full overflow-y-auto pr-6 grid gap-8">
        <FrameSection />
        <section className="bg-yellow-400 h-[80vh]">

        </section>

        {/* <VideoPlayerSection 
          id={video.id}
          // fps={video.fps}
          fps={30}
        /> */}
      </div>
    </div>
  );
};

export default VideoPage;
