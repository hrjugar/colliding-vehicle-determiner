import { createHashRouter } from "react-router-dom";
import App from "../App";
import VideosPage from "../pages/VideosPage";
import AnalysisPage from "../pages/AnalysisPage";

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