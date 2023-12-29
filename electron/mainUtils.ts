import { BrowserWindow, app, dialog, shell } from "electron"
import Database from "better-sqlite3"
import path from "node:path"
import ffmpeg from "fluent-ffmpeg"
import fs from "node:fs"
import axios from "axios"
import { spawn } from "node:child_process"

export const THUMBNAIL_FILENAME = "thumbnail.png"

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
  return path.join(app.getPath('userData'), path.sep, id.toString());
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
        console.log(`createThumbnail: file exists = ${fs.existsSync(path.join(videoDataFolder, path.sep, THUMBNAIL_FILENAME))}`)
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
  const newFilePath = path.join(folder, path.sep, `${newFileName}.mp4`)
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
  const tempFolderPath = path.join(app.getPath('userData'), path.sep, 'temp')
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath)
  }
  
  const outputVideoPath = path.join(tempFolderPath, path.sep, `trimmed.mp4`)

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .outputOptions('-c', 'copy')
      .save(outputVideoPath)
      .on('progress', (progress) => {
        event.sender.send('trim:progress', {
          "percent": progress.percent,
          "displayText": `${progress.percent}%`
        })
      })
      .on('end', () => {
        resolve(outputVideoPath)
      })
      .on('error', (err) => {
        reject(err)
      })
      .run()
  });
}

export function extractFrames(event: Electron.IpcMainInvokeEvent) {
  const tempFolderPath = path.join(app.getPath('userData'), path.sep, 'temp')
  const trimmedVideoPath = path.join(tempFolderPath, path.sep, 'trimmed.mp4')

  const framesFolderPath = path.join(tempFolderPath, path.sep, 'frames')
  if (fs.existsSync(framesFolderPath)) {
    fs.rmSync(framesFolderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(framesFolderPath);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(trimmedVideoPath, (err, metadata) => {
      if (err) {
        reject(err)
        return;
      }

      const frameRate = metadata.streams[0].avg_frame_rate

      ffmpeg(trimmedVideoPath)
        .outputOptions('-vf', `fps=${frameRate}`)
        .output(path.join(framesFolderPath, path.sep, '%d.png'))
        .on('progress', (progress) => {
          event.sender.send('extractFrames:progress', {
            "percent": progress.percent,
            "displayText": `${progress.percent}%`
          })
        })
        .on('end', resolve)
        .on('error', reject)
        .run();
    })
  });
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

  let args = [scriptPath, framesFolderPath, outputFolderPath];

  return new Promise((resolve, reject) => {
    let process = spawn('python', [...args])

    process.on('error', (err) => {
      console.log("Python script error")
      console.log(err)
      reject(err)
    })

    process.on('close', () => {
      resolve(true)
    });
  });
}

// TODO: REMOVE REDUNDANT path.sep IN EVERY path.join() (path.join() uses path.sep by default)