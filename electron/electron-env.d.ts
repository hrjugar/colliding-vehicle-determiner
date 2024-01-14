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
  minimizeWindow(): void,
  maximizeWindow(): void,
  closeWindow(): void,
  findNewVideo(): Promise<string| undefined>,
  insertVideo(): Promise<boolean>,
  selectAllVideos(): Promise,
  getAppPath(): Promise<string>,
  deleteVideo(id: number | bigint): Promise,
  openVideoFolder(filePath: string): Promise,
  renameVideo(id: number | bigint, oldFilePath: string, newFileName: string): Promise,
  isFileExisting(filePath: string): Promise<boolean>,
  updateVideo(id: number | bigint): Promise<string>,

  getVideoFPS(videoPath: string): Promise<number>,
  
  trimVideo(videoPath: string, startTime: number, endTime: number): Promise<void>,
  onTrimProgress(callback: Function): void,
  removeTrimProgressListener(): void,

  extractFrames(): Promise<void>,
  onExtractFramesProgress(callback: Function): void,
  removeExtractFramesProgressListener(): void,

  killPythonProcess(): void,

  runAccidentDetectionModel(confidenceThreshold: number, iouThreshold: number): Promise,
  onRunAccidentDetectionModelProgress(callback: Function): void,
  removeRunAccidentDetectionModelProgressListener(): void,

  runDeepSORTModel(): Promise<any[]>,
  onRunDeepSORTModelProgress(callback: Function): void,
  removeRunDeepSORTModelProgressListener(): void,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: ElectronAPI
}
