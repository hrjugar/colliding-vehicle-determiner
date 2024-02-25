import useGlobalStore from "@/renderer/globals/store";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function WindowButtonGroup() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isWindowButtonGroupColorLight] = useGlobalStore((state) => [state.isWindowButtonGroupColorLight]);

  useEffect(() => {
    window.ipcRenderer.on('window-unmaximized', () => setIsMaximized(false));
    window.ipcRenderer.on('window-maximized', () => setIsMaximized(true));

    return () => {
      window.ipcRenderer.removeAllListeners('window-unmaximized');
      window.ipcRenderer.removeAllListeners('window-maximized');
    }
  }, []);

  return createPortal(
    (
    <div id="window-button-group" className="fixed top-0 right-0 flex flex-row justify-end h-min w-min pointer-events-none z-[999]">
      <div className="flex flex-row justify-end items-center pointer-events-auto">
        <button 
          className={`group p-4 bg-transparent cursor-pointer hover:bg-gray-200`}
          onClick={() => window.electronAPI.minimizeWindow()}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className={`w-3 h-3 ${isWindowButtonGroupColorLight ? 'text-white group-hover:text-color-primary' : 'text-color-primary'}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0 40 H64 z"
              className="stroke-current stroke-[4]"
            />
          </svg>
        </button>

        <button 
          className={"group p-4 bg-transparent hover:bg-gray-200 cursor-pointer"}
          onClick={() => window.electronAPI.maximizeWindow()}
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 h-3 ${isWindowButtonGroupColorLight ? 'text-white group-hover:text-color-primary' : 'text-color-primary'}`}
          >
            {isMaximized ? (
              <path 
                d="M2 14 V 62 H50 V14 z M14 2 H 62 V 50 H 50 V14 H14 z"
                className="fill-transparent stroke-current stroke-[4]"
              />
            ) : (
              <path 
                d="M0 0 V 64 H64 V0 Z" 
                className="fill-transparent stroke-current stroke-[8]"
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
            className={`w-3 h-3 ${isWindowButtonGroupColorLight ? 'text-white' : 'text-color-primary group-hover/titlebar-close-btn:text-white'}`}
          >
            <path 
              d="M0 0 L64 64 M64 0 L0 64 Z"
              className="fill-transparent stroke-current stroke-[4]"
            />
          </svg>
        </button>

      </div>
    </div>    
    ),
    document.body
  )
}