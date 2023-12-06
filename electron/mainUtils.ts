import { app, dialog, shell } from "electron"
import Database from "better-sqlite3"
import path from "node:path"
import ffmpeg from "fluent-ffmpeg"
import fs from "node:fs"

export const THUMBNAIL_FILENAME = "thumbnail.png"

export function getVideoDataFolder(id: number | bigint) {
  return path.join(app.getPath('userData'), path.sep, id.toString());
}

export function isFileExisting(filePath: string) {
  return fs.existsSync(filePath)
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