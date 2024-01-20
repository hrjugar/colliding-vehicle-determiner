import { createHashRouter } from "react-router-dom";
import App from "../App";
import VideosPage from "../pages/videos";
import AnalysisPage from "../pages/analysis";

export const router = createHashRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <VideosPage />,
        handle: {
          name: "Videos",
        }
      },
      {
        path: "/videos/:id",
        element: <div></div>,
        handle: {
          name: "Videos",
        }
      },
      {
        path: "/analysis",
        element: <AnalysisPage />,
        handle: {
          name: "Analysis"
        }
      },
    ]
  }
])