import { contextBridge, ipcRenderer } from 'electron'


// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));
// contextBridge.exposeInMainWorld('testExpose', "testExpose");
contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('titleBar:minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('titleBar:maximizeWindow'),
  closeWindow: () => ipcRenderer.send('titleBar:closeWindow'),
  findNewVideo: () => ipcRenderer.invoke('findNewVideo'),
  insertVideo: (filePath: string) => ipcRenderer.invoke('dialog:insertVideo', filePath),
  selectAllVideos: () => ipcRenderer.invoke('selectAllVideos'),
  getAppPath: () => ipcRenderer.invoke('getAppPath'),
  deleteVideo: (id: number | bigint) => ipcRenderer.invoke('deleteVideo', id),
  openVideoFolder: (filePath: string) => ipcRenderer.invoke('openVideoFolder', filePath),
  renameVideo: (id: number | bigint, oldFilePath: string, newFileName: string) => ipcRenderer.invoke('renameVideo', id, oldFilePath, newFileName),
  isFileExisting: (filePath: string) => ipcRenderer.invoke('isFileExisting', filePath),
  updateVideo: (id: number | bigint) => ipcRenderer.invoke('updateVideo', id),

  getVideoFPS: (videoPath: string) => ipcRenderer.invoke('getVideoFPS', videoPath),

  trimVideo: (videoPath: string, startTime: number, endTime: number) => ipcRenderer.invoke('trim:trimVideo', videoPath, startTime, endTime),
  onTrimProgress: (callback: Function) => ipcRenderer.on('trim:progress', (_, progress) => callback(progress)),
  removeTrimProgressListener: () => ipcRenderer.removeAllListeners('trim:progress'),

  extractFrames: () => ipcRenderer.invoke('extractFrames'),
  onExtractFramesProgress: (callback: Function) => ipcRenderer.on('extractFrames:progress', (_, progress) => callback(progress)),
  removeExtractFramesProgressListener: () => ipcRenderer.removeAllListeners('extractFrames:progress'),

  killPythonProcess: () => ipcRenderer.send('killPythonProcess'),
  
  runAccidentDetectionModel: (confidenceThreshold: number, iouThreshold: number) => ipcRenderer.invoke('model:accidentDetection', confidenceThreshold, iouThreshold),
  onRunAccidentDetectionModelProgress: (callback: Function) => ipcRenderer.on('model:accidentDetection:progress', (_, progress) => callback(progress)),
  removeRunAccidentDetectionModelProgressListener: () => ipcRenderer.removeAllListeners('model:accidentDetection:progress'),

  runDeepSORTModel: (yoloModel: string) => ipcRenderer.invoke('model:deepSORT', yoloModel),
  onRunDeepSORTModelProgress: (callback: Function) => ipcRenderer.on('model:deepSORT:progress', (_, progress) => callback(progress)),
  removeRunDeepSORTModelProgressListener: () => ipcRenderer.removeAllListeners('model:deepSORT:progress'),

  copyDeepSORTVideo: () => ipcRenderer.invoke('copyDeepSORTVideo'),
})

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

// setTimeout(removeLoading, 4999)
