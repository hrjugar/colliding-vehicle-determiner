import { useState, useEffect } from "react";

export default function WindowButtonGroup() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    window.ipcRenderer.on('window-unmaximized', () => setIsMaximized(false));
    window.ipcRenderer.on('window-maximized', () => setIsMaximized(true));

    return () => {
      window.ipcRenderer.removeAllListeners('window-unmaximized');
      window.ipcRenderer.removeAllListeners('window-maximized');
    }
  }, []);

  return (
    <div id="window-button-group" className="flex flex-row h-min">
      <button 
        className="p-4 bg-transparent hover:bg-gray-200 cursor-pointer"
        onClick={() => window.electronAPI.minimizeWindow()}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="w-3 h-3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 40 H64 z"
            className="fill-current stroke-[4] stroke-color-primary"
          />
        </svg>
      </button>

      <button 
        className="p-4 bg-transparent hover:bg-gray-200 cursor-pointer"
        onClick={() => window.electronAPI.maximizeWindow()}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 text-transparent stroke-[4] stroke-color-primary"
        >
          {isMaximized ? (
            <path 
              d="M2 14 V 62 H50 V14 z M14 2 H 62 V 50 H 50 V14 H14 z"
              className="fill-current"
            />
          ) : (
            <path 
              d="M0 0 V 64 H64 V0 Z" 
              className="fill-current stroke-[8] stroke-black"
            />
          )}
        </svg>
      </button>

      <button 
        className="group/titlebar-close-btn p-4 bg-transparent hover:bg-[#E81123] cursor-pointer"
        onClick={() => window.electronAPI.closeWindow()}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
        >
          <path 
            d="M0 0 L64 64 M64 0 L0 64 Z"
            className="fill-current stroke-[4] stroke-color-primary group-hover/titlebar-close-btn:stroke-white"
          />
        </svg>
      </button>
    </div>    
  )
}