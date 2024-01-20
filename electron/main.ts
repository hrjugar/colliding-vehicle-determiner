import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { getSqlite3 } from './better-sqlite3'
import { closeWindow, copyDeepSORTVideo, createThumbnailFromId, deleteVideo, extractFrames, findNewVideo, getVideoFPS, insertVideo, isFileExisting, killPythonProcess, maximizeWindow, minimizeWindow, openVideoFolder, renameVideo, runAccidentDetectionModel, runDeepSORTModel, selectAllVideos, THUMBNAIL_FILENAME, trimVideo, updateVideo } from './mainUtils'
import Database from 'better-sqlite3'
import { stopServer } from './server'
import { initSocket } from './zeromq'
import { ChildProcessWithoutNullStreams } from 'child_process';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged 
  ? process.env.DIST 
  : path.join(process.env.DIST, '../public')

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}  

let win: BrowserWindow | null
let db: Database.Database
let pythonProcess: ChildProcessWithoutNullStreams;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'video',
    privileges: {
      bypassCSP: true,
      stream: true
    }
  }
])

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    frame: false,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    }
  })
  win.maximize();
  
  win.webContents.openDevTools();

  // Opens external links in browser instead of new Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return {
      action: 'deny'
    };
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    // win?.webContents.send('main-process-message', (new Date).toLocaleString())
    initSocket(win!);
    db = getSqlite3()
    win?.webContents.send('sqlite3', db);
  })


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  ipcMain.on('titleBar:minimizeWindow', () => minimizeWindow(win!));
  ipcMain.on('titleBar:maximizeWindow', () => maximizeWindow(win!));
  ipcMain.on('titleBar:closeWindow', () => closeWindow(win!));

  win.on('maximize', () => {
    win?.webContents.send('window-maximized')
  })
  
  win.on('unmaximize', () => {
    win?.webContents.send('window-unmaximized')
  })
}

app.disableHardwareAcceleration()

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopServer()
    app.quit()
    win = null
    db.close()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  protocol.handle('thumbnail', async (request) => {
    console.log(`thumbnail: request url = ${request.url}`)
    const id = request.url.replace('thumbnail://', '')
    console.log(`thumbnail: userdata path = ${app.getPath('userData')}`)
    const src = path.join(app.getPath('userData'), 'videos', id, THUMBNAIL_FILENAME)
    // const src = path.join(app.getPath('userData'), path.sep, id, path.sep, THUMBNAIL_FILENAME)

    console.log(`thumbnail: id is ${id}`)
    console.log("thumbnail: acquired src")

    if (fs.existsSync(src)) {
      console.log("thumbnail: file exists")
      return net.fetch(src)
    }

    console.log("thumbnail: file does not exist")

    await createThumbnailFromId(db, parseInt(id))
    console.log("thumbnail: created thumbnail")

    console.log(`thumbnail: src exists: ${fs.existsSync(src)}`)
    return net.fetch(src);
  })

  protocol.handle('filehandler', async (request) => {
    console.log('file handler: request url = ' + request.url);
    const [_, handlerType, handlerValue] = request.url.split('//');

    let src;
    switch (handlerType) {
      case "tempFrame":
      default:
        src = path.join(app.getPath('userData'), 'temp', 'frames', `${handlerValue}.png`)
        break;
    }

    return net.fetch(src);
  })

  ipcMain.handle('findNewVideo', () => findNewVideo())
  ipcMain.handle('dialog:insertVideo', (_, filePath: string) => insertVideo(db, filePath))
  ipcMain.handle('selectAllVideos', () => selectAllVideos(db))
  ipcMain.handle('getAppPath', () => app.getPath('userData'))
  ipcMain.handle('deleteVideo', (_, id) => deleteVideo(db, id))
  ipcMain.handle('openVideoFolder', (_, filePath) => openVideoFolder(filePath))
  ipcMain.handle('renameVideo', (_, id, oldFilePath, newFileName) => renameVideo(db, id, oldFilePath, newFileName))
  ipcMain.handle('isFileExisting', (_, filePath) => isFileExisting(filePath))
  ipcMain.handle('updateVideo', (_, id) => updateVideo(db, id))

  ipcMain.handle('getVideoFPS', (_, videoPath) => getVideoFPS(videoPath))

  ipcMain.handle('trim:trimVideo', (event, videoPath, startTime, endTime) => trimVideo(event, videoPath, startTime, endTime))
  ipcMain.handle('extractFrames', (event) => extractFrames(event))

  ipcMain.on('killPythonProcess', () => killPythonProcess())

  ipcMain.handle('model:accidentDetection', (_, confidenceThreshold, iouThreshold) => runAccidentDetectionModel(confidenceThreshold, iouThreshold))
  ipcMain.handle('model:deepSORT', (_, yoloModel) => runDeepSORTModel(yoloModel))

  ipcMain.handle('copyDeepSORTVideo', () => copyDeepSORTVideo())
  
  createWindow()
})