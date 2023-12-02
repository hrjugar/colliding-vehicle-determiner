import { app, dialog } from "electron"
import Database from "better-sqlite3"
import path from "node:path"
import ffmpeg from "fluent-ffmpeg"
import fs from "node:fs"


export function createThumbnail(filePath: string, id: number | bigint) {
  ffmpeg(filePath).screenshots({
    timestamps: ['50%'],
    count: 1,
    filename: `${id}.png`,
  }, path.join(app.getPath('userData'), path.sep, 'thumbnails'));

  console.log("Created thumbnail.");
}

export function createThumbnailFromId(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);

  if (video) {
    createThumbnail(video.path, id)
  }
}

export function getThumbnail(id: number | bigint) {
  const thumbnailPath = path.join(app.getPath('userData'), path.sep, 'thumbnails', path.sep, `${id}.png`)
  return `file://${thumbnailPath}`
}

export async function handleInsertVideo(db: Database.Database) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: 'MP4 Files', extensions: ['mp4'] }
    ]
  })
  
  if (!canceled) {
    const filePath = filePaths[0]
    const statement = db.prepare('INSERT INTO videos (path) VALUES (?)').run(filePath)
    createThumbnail(filePath, statement.lastInsertRowid)
    return filePath
  }
}

export function selectAllVideos(db: Database.Database) {
  console.log("Selected all videos")
  console.log(app.getPath('userData'))
  const videos = db.prepare('SELECT * FROM videos').all()
  return videos
}

export function deleteVideo(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);
  if (video) {
    db.prepare('DELETE FROM videos WHERE id = ?').run(id)
    console.log(`Removed video ${id} from database.`)
    const thumbnailPath = path.join(app.getPath('userData'), path.sep, 'thumbnails', path.sep, `${id}.png`)
    fs.unlinkSync(thumbnailPath)
    console.log(`Deleted thumbnail file.`)
  }
}
