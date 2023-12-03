import { app, BrowserWindow, ipcMain, Menu, MenuItem, net, protocol, shell } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { getSqlite3 } from './better-sqlite3'
import { createThumbnailFromId, deleteVideo, insertVideo, isFileExisting, openVideoFolder, renameVideo, selectAllVideos, updateVideo } from './mainUtils'
import Database from 'better-sqlite3'

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
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      // webSecurity: false // TODO: Change this to true later! Currently needed in false to read file data
    }
  })

  // win.removeMenu();

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
    db = getSqlite3()
    win?.webContents.send('sqlite3', db);
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
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
    const id = request.url.replace('thumbnail://', '')
    const src = app.getPath('userData') + path.sep + 'thumbnails' + path.sep + id + '.png'

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
  // ipcMain.on('magic-protocol', (_, imageName) => {
  //   imageName = imageName.replace('magic-protocol://getThumbnail/', '')
  //   let imagePath = path.join(app.getPath('userData'), path.sep, 'thumbnails', path.sep, imageName, ".png")
  //   let imageUrl = url.pathToFileURL(imagePath).toString()

  //   protocol.handle('thumbnail', (_) => {
  //     return net.fetch(imageUrl)
  //   })
  // })

  ipcMain.handle('dialog:insertVideo', () => insertVideo(db))
  ipcMain.handle('selectAllVideos', () => selectAllVideos(db))
  ipcMain.handle('getAppPath', () => app.getPath('userData'))
  ipcMain.handle('deleteVideo', (_, id) => deleteVideo(db, id))
  ipcMain.handle('openVideoFolder', (_, filePath) => openVideoFolder(filePath))
  ipcMain.handle('renameVideo', (_, id, oldFilePath, newFileName) => renameVideo(db, id, oldFilePath, newFileName))
  ipcMain.handle('isFileExisting', (_, filePath) => isFileExisting(filePath))
  ipcMain.handle('updateVideo', (_, id) => updateVideo(db, id))
  createWindow()
})