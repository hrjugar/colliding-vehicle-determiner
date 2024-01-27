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
  insertVideo(video: VideoDataInput): Promise<number | bigint>,
  selectAllVideos(): Promise<VideoData[]>,
  selectVideo(id: number | bigint): Promise<VideoData>,
  getAppPath(): Promise<string>,
  deleteVideo(id: number | bigint): Promise<void>,
  openVideoFolder(filePath: string): Promise<void>,
  renameVideo(id: number | bigint, oldFilePath: string, newFileName: string): Promise<void>,
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

  runAccidentDetectionModel(confidenceThreshold: number, iouThreshold: number): Promise<number | null>,
  onRunAccidentDetectionModelProgress(callback: Function): void,
  removeRunAccidentDetectionModelProgressListener(): void,

  runDeepSORTModel(yoloModel: string): Promise<DeepSORTOutput>,
  onRunDeepSORTModelProgress(callback: Function): void,
  removeRunDeepSORTModelProgressListener(): void,

  copyDeepSORTVideo(): Promise<void>,

  getAccidentDetectionModelResults(id: number | bigint): Promise<BoundingBoxWithConfidence[][]>,
  getDeepSORTModelResults(id: number | bigint): Promise<DeepSORTOutput>,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: ElectronAPI
}
