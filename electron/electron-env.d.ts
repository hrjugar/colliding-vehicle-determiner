/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface ElectronAPI {
  findNewVideo(): Promise<string| undefined>,
  insertVideo(): Promise<boolean>,
  selectAllVideos(): Promise,
  getAppPath(): Promise<string>,
  deleteVideo(id: number | bigint): Promise,
  openVideoFolder(filePath: string): Promise,
  renameVideo(id: number | bigint, oldFilePath: string, newFileName: string): Promise,
  isFileExisting(filePath: string): Promise<boolean>,
  updateVideo(id: number | bigint): Promise<string>,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: ElectronAPI
}
