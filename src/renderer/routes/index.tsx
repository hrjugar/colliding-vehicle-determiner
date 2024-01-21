import { createHashRouter } from "react-router-dom";
import App from "../App";
import VideosPage from "../pages/videos";
import AnalysisPage from "../pages/analysis";
import VideoPage from "@renderer/pages/video";
import RedirectToVideosPage from "@renderer/components/RedirectToVideosPage";

export const router = createHashRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <RedirectToVideosPage />
      },
      {
        path: "videos",
        children: [
          {
            index: true,
            element: <VideosPage />,
          },
          {
            path: ":id",
            element: <VideoPage />,
            loader: async ({ params }) => await window.electronAPI.selectVideo(parseInt(params.id!)),
          },
        ]
      },
      {
        path: "analysis",
        element: <AnalysisPage />,
      },
    ]
  }
])