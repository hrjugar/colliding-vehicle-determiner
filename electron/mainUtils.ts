import { BrowserWindow, app, dialog, shell } from "electron"
import Database from "better-sqlite3"
import path from "node:path"
import ffmpeg from "fluent-ffmpeg"
import fs from "node:fs"
import { spawn, ChildProcessWithoutNullStreams } from "node:child_process"
const zmq: typeof import("zeromq") = require("zeromq");

export const THUMBNAIL_FILENAME = "thumbnail.png"
let pythonProcess: ChildProcessWithoutNullStreams;

export function minimizeWindow(window: BrowserWindow) {
  window.minimize()
}

export function maximizeWindow(window: BrowserWindow) {
  console.log(`maximizeWindow: window is maximized = ${window.isMaximized()}`)
  if (window.isMaximized()) {
    window.unmaximize()
  } else {
    window.maximize()
  }
}

export function closeWindow(window: BrowserWindow) {
  window.close()
}

export function getVideoDataFolder(id: number | bigint) {
  return path.join(app.getPath('userData'), id.toString());
}

export function isFileExisting(filePath: string) {
  return fs.existsSync(filePath)
}

export async function findNewVideo() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: 'MP4 Files', extensions: ['mp4'] }
    ]
  })

  if (!canceled) {
    return filePaths[0]
  }
}

export function createThumbnail(filePath: string, id: number | bigint) {
  const videoDataFolder = getVideoDataFolder(id)
  if (!isFileExisting(videoDataFolder)) {
    fs.mkdirSync(videoDataFolder)
  }

  console.log(`createThumbnail: thumbnail folder path is ${videoDataFolder}`)

  return new Promise((resolve, _) => {
    ffmpeg(filePath)
      .screenshots({
        timestamps: ['50%'],
        count: 1,
        filename: THUMBNAIL_FILENAME,
      }, videoDataFolder)
      .on('error', () => {
        console.log("Error in creating thumbnail.")
      })
      .on('end', () => {
        resolve(filePath)
        console.log("createThumbnail: Created thumbnail.");
        console.log(`createThumbnail: file exists = ${fs.existsSync(path.join(videoDataFolder, THUMBNAIL_FILENAME))}`)
      });
  })
}

export async function createThumbnailFromId(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);

  if (video) {
    await createThumbnail(video.path, id)
    console.log("createThumbnailFromId: Created thumbnail from ID")
  }
}

export async function insertVideo(db: Database.Database) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: 'MP4 Files', extensions: ['mp4'] }
    ]
  })
  
  if (!canceled) {
    const filePath = filePaths[0]
    const statement = db.prepare('INSERT INTO videos (path) VALUES (?)').run(filePath)
    fs.mkdirSync(getVideoDataFolder(statement.lastInsertRowid))
    await createThumbnail(filePath, statement.lastInsertRowid)
  }

  return !canceled
}

export function selectAllVideos(db: Database.Database) {
  const videos = db.prepare('SELECT * FROM videos').all()
  return videos
}

export function deleteVideo(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);
  if (video) {
    db.prepare('DELETE FROM videos WHERE id = ?').run(id)
    console.log(`Removed video ${id} from database.`)
    fs.rmSync(getVideoDataFolder(id), {
      recursive: true
    })
    console.log(`Deleted thumbnail file.`)
  }
}

export function openVideoFolder(filePath: string) {
  const folder = path.dirname(filePath);
  console.log(`openVideoFolder: folder = ${folder}`);
  shell.openPath(folder);
}

export function renameVideo(db: Database.Database, id: number | bigint, oldFilePath: string, newFileName: string) {
  const folder = path.dirname(oldFilePath);
  const newFilePath = path.join(folder, `${newFileName}.mp4`)
  console.log(`renameVideo: oldFilePath = ${oldFilePath}`)
  console.log(`renameVideo: newFilePath = ${newFilePath}`)
  fs.renameSync(oldFilePath, newFilePath)

  db
    .prepare(`
      UPDATE videos
        SET path = (?)
        WHERE id = (?)
    `)
    .run(newFilePath, id)
  
  console.log(`renameVideo: Renamed video ${id} from ${oldFilePath} to ${newFilePath}.`)
}

export async function updateVideo(db: Database.Database, id: number | bigint) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: 'MP4 Files', extensions: ['mp4'] }
    ]
  })

  if (!canceled) {
    const filePath = filePaths[0]
    db
      .prepare(`
        UPDATE videos
          SET path = (?)
          WHERE id = (?)
      `)
      .run(filePath, id)
    await createThumbnail(filePath, id)
    return filePath
  }

  console.log("updateVideo: Updated video.")
  return ''
}

export function trimVideo(event: Electron.IpcMainInvokeEvent, videoPath: string, startTime: number, endTime: number) {
  const tempFolderPath = path.join(app.getPath('userData'), 'temp')
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath)
  }
  
  const outputVideoPath = path.join(tempFolderPath, `trimmed.mp4`)

  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .outputOptions('-c', 'copy')
      .save(outputVideoPath)
      .on('progress', (progress) => {
        event.sender.send('trim:progress', {
          "percent": progress.percent,
          "displayText": `${Math.round(progress.percent)}%`
        })
      })
      .on('end', () => {
        resolve()
      })
      .on('error', (err) => {
        reject(err)
      })
      .run()
  });
}

export function extractFrames(event: Electron.IpcMainInvokeEvent) {
  const tempFolderPath = path.join(app.getPath('userData'), 'temp')
  const trimmedVideoPath = path.join(tempFolderPath, 'trimmed.mp4')

  const framesFolderPath = path.join(tempFolderPath, 'frames')
  if (fs.existsSync(framesFolderPath)) {
    fs.rmSync(framesFolderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(framesFolderPath);

  return new Promise<void>((resolve, reject) => {
    ffmpeg.ffprobe(trimmedVideoPath, (err, metadata) => {
      if (err) {
        reject(err)
        return;
      }

      const frameRate = metadata.streams[0].avg_frame_rate

      ffmpeg(trimmedVideoPath)
        .outputOptions('-vf', `fps=${frameRate}`)
        .output(path.join(framesFolderPath, '%d.png'))
        .on('progress', (progress) => {
          event.sender.send('extractFrames:progress', {
            "percent": progress.percent,
            "displayText": `${Math.round(progress.percent)}%`
          })
        })
        .on('end', () => {
          resolve();
        })
        .on('error', reject)
        .run();
    })
  });
}

export function killPythonProcess() {
  console.log("Trying to kill python process...")
  if (pythonProcess) {
    pythonProcess.kill();
    console.log("Killed python process");
  } else {
    console.log("No python processes detected.")
  }
}

export function runAccidentDetectionModel() {
  let scriptPath = path.join(
    app.getAppPath(),
    'python-scripts',
    'accident-detection',
    'predict.py'
  )
  let framesFolderPath = path.join(
    app.getPath('userData'),
    'temp',
    'frames'
  )
  let outputFolderPath = path.join(
    app.getPath('userData'),
    'temp'
  )
  let rootFolderPath = app.getAppPath()

  console.log("RUNNING ACCIDENT DETECTION MODEL")

  if (pythonProcess) {
    pythonProcess.kill();
  }
  pythonProcess = spawn('python', [scriptPath, framesFolderPath, outputFolderPath, rootFolderPath]);
  
  return new Promise((resolve, reject) => {
    pythonProcess.on('error', (err) => {
      console.log("Python script error")
      console.log(err)
      reject(err);
    })
  
    pythonProcess.stderr.on('data', (data) => {
      console.log("Python script error")
      console.log(data.toString());
    })
  
    pythonProcess.on('exit', (code) => {
      console.log(`Python exited with code ${code}`);
      resolve(code);
    })
  })
}