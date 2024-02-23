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
          path TEXT NOT NULL,
          fps REAL NOT NULL,
          trimStart REAL NOT NULL,
          trimEnd REAL NOT NULL,
          accidentModelConfidenceThreshold REAL NOT NULL,
          accidentModelIOUThreshold REAL NOT NULL,
          deepSORTModel TEXT NOT NULL,
          accidentFrame INTEGER,
          accidentAreaX REAL,
          accidentAreaY REAL,
          accidentAreaW REAL,
          accidentAreaH REAL,
          accidentAreaXN REAL,
          accidentAreaYN REAL,
          accidentAreaWN REAL,
          accidentAreaHN REAL,
          accidentFrameVehicleOneId INTEGER,
          accidentFrameVehicleOneX REAL,
          accidentFrameVehicleOneY REAL,
          accidentFrameVehicleOneW REAL,
          accidentFrameVehicleOneH REAL,
          accidentFrameVehicleOneXN REAL,
          accidentFrameVehicleOneYN REAL,
          accidentFrameVehicleOneWN REAL,
          accidentFrameVehicleOneHN REAL,
          accidentFrameVehicleOneProbability REAL,
          accidentFrameVehicleTwoId INTEGER,
          accidentFrameVehicleTwoX REAL,
          accidentFrameVehicleTwoY REAL,
          accidentFrameVehicleTwoW REAL,
          accidentFrameVehicleTwoH REAL,
          accidentFrameVehicleTwoXN REAL,
          accidentFrameVehicleTwoYN REAL,
          accidentFrameVehicleTwoWN REAL,
          accidentFrameVehicleTwoHN REAL,
          accidentFrameVehicleTwoProbability REAL,
          timestamp DATETIME
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

