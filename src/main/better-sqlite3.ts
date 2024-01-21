import { app } from 'electron'
import path from 'node:path'
import Database from 'better-sqlite3'

const root = path.join(__dirname, '..')
const TAG = '[better-sqlite3]'
let database: Database.Database

export function getSqlite3(filename = path.join(app.getPath('userData'), 'appdb.sqlite3')) {
  database ??= new Database(filename, {
    nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING),
  })

  database
    .prepare(`
      CREATE TABLE IF NOT EXISTS 
        videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          path TEXT NOT NULL
        )
    `)
    .run()
  return database;
}

export function insertVideo(filePath: string) {
  const stmt = database.prepare('INSERT INTO videos (path) VALUES (?)')
  stmt.run(filePath)
}

export function getAllVideos() {
  const stmt = database.prepare('SELECT * FROM videos')
  return stmt.all()
}

