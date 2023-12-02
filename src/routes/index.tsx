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
        element: <VideosPage />
      },
      {
        path: "/analysis",
        element: <AnalysisPage />
      }
    ]
  }
])