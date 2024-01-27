import { BrowserWindow, app, dialog, shell } from "electron"
import Database from "better-sqlite3"
import path from "node:path"
import ffmpeg from "fluent-ffmpeg"
import fs from "node:fs"
import { spawn, ChildProcessWithoutNullStreams } from "node:child_process"
const zmq: typeof import("zeromq") = require("zeromq");
import fsExtra from "fs-extra";

export const THUMBNAIL_FILENAME = "thumbnail.png"
let pythonProcess: ChildProcessWithoutNullStreams;

function convertDatabaseVideoData(video: DatabaseVideoData): VideoData {
  return {
    id: video.id,
    path: video.path,
    fps: video.fps,
    trimStart: video.trimStart,
    trimEnd: video.trimEnd,
    accidentModelConfidenceThreshold: video.accidentModelConfidenceThreshold,
    accidentModelIOUThreshold: video.accidentModelIOUThreshold,
    deepSORTModel: video.deepSORTModel,
    accidentFrame: video.accidentFrame,
    accidentArea: 
    (
      video.accidentAreaX !== undefined && video.accidentAreaX !== null && 
      video.accidentAreaY !== undefined && video.accidentAreaY !== null && 
      video.accidentAreaW !== undefined && video.accidentAreaW !== null && 
      video.accidentAreaH !== undefined && video.accidentAreaH !== null &&
      video.accidentAreaXN !== undefined && video.accidentAreaXN !== null &&
      video.accidentAreaYN !== undefined && video.accidentAreaYN !== null &&
      video.accidentAreaWN !== undefined && video.accidentAreaWN !== null &&
      video.accidentAreaHN !== undefined && video.accidentAreaHN !== null 
    ) ? {
        x: video.accidentAreaX,
        y: video.accidentAreaY,
        w: video.accidentAreaW,
        h: video.accidentAreaH,
        xn: video.accidentAreaXN,
        yn: video.accidentAreaYN,
        wn: video.accidentAreaWN,
        hn: video.accidentAreaHN,
    } : undefined,
    accidentFrameVehicleOne: 
    (
      video.accidentFrameVehicleOneId !== undefined && video.accidentFrameVehicleOneId !== null &&
      video.accidentFrameVehicleOneX !== undefined && video.accidentFrameVehicleOneX !== null && 
      video.accidentFrameVehicleOneY !== undefined && video.accidentFrameVehicleOneY !== null && 
      video.accidentFrameVehicleOneW !== undefined && video.accidentFrameVehicleOneW !== null && 
      video.accidentFrameVehicleOneH !== undefined && video.accidentFrameVehicleOneH !== null &&
      video.accidentFrameVehicleOneXN !== undefined && video.accidentFrameVehicleOneXN !== null &&
      video.accidentFrameVehicleOneYN !== undefined && video.accidentFrameVehicleOneYN !== null &&
      video.accidentFrameVehicleOneWN !== undefined && video.accidentFrameVehicleOneWN !== null &&
      video.accidentFrameVehicleOneHN !== undefined && video.accidentFrameVehicleOneHN !== null 
    ) ? {
        id: video.accidentFrameVehicleOneId,
        x: video.accidentFrameVehicleOneX,
        y: video.accidentFrameVehicleOneY,
        w: video.accidentFrameVehicleOneW,
        h: video.accidentFrameVehicleOneH,
        xn: video.accidentFrameVehicleOneXN,
        yn: video.accidentFrameVehicleOneYN,
        wn: video.accidentFrameVehicleOneWN,
        hn: video.accidentFrameVehicleOneHN,
    } : undefined,
    accidentFrameVehicleTwo: 
    (
      video.accidentFrameVehicleTwoId !== undefined && video.accidentFrameVehicleTwoId !== null &&
      video.accidentFrameVehicleTwoX !== undefined && video.accidentFrameVehicleTwoX !== null && 
      video.accidentFrameVehicleTwoY !== undefined && video.accidentFrameVehicleTwoY !== null && 
      video.accidentFrameVehicleTwoW !== undefined && video.accidentFrameVehicleTwoW !== null && 
      video.accidentFrameVehicleTwoH !== undefined && video.accidentFrameVehicleTwoH !== null &&
      video.accidentFrameVehicleTwoXN !== undefined && video.accidentFrameVehicleTwoXN !== null &&
      video.accidentFrameVehicleTwoYN !== undefined && video.accidentFrameVehicleTwoYN !== null &&
      video.accidentFrameVehicleTwoWN !== undefined && video.accidentFrameVehicleTwoWN !== null &&
      video.accidentFrameVehicleTwoHN !== undefined && video.accidentFrameVehicleTwoHN !== null 
    ) ? {
        id: video.accidentFrameVehicleTwoId,
        x: video.accidentFrameVehicleTwoX,
        y: video.accidentFrameVehicleTwoY,
        w: video.accidentFrameVehicleTwoW,
        h: video.accidentFrameVehicleTwoH,
        xn: video.accidentFrameVehicleTwoXN,
        yn: video.accidentFrameVehicleTwoYN,
        wn: video.accidentFrameVehicleTwoWN,
        hn: video.accidentFrameVehicleTwoHN,
    } : undefined,
  }
}

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
  const videosFolder = path.join(app.getPath('userData'), 'videos');
  if (!fs.existsSync(videosFolder)) {
    fs.mkdirSync(videosFolder);
  }

  return path.join(videosFolder, id.toString());
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

export async function insertVideo(db: Database.Database, video: VideoData) {
  const statement = db.prepare(`INSERT INTO videos (
    path,
    fps,
    trimStart,
    trimEnd,
    accidentModelConfidenceThreshold,
    accidentModelIOUThreshold,
    deepSORTModel,
    accidentFrame,
    accidentAreaX,
    accidentAreaY,
    accidentAreaW,
    accidentAreaH,
    accidentAreaXN,
    accidentAreaYN,
    accidentAreaWN,
    accidentAreaHN,
    accidentFrameVehicleOneId,
    accidentFrameVehicleOneX,
    accidentFrameVehicleOneY,
    accidentFrameVehicleOneW,
    accidentFrameVehicleOneH,
    accidentFrameVehicleOneXN,
    accidentFrameVehicleOneYN,
    accidentFrameVehicleOneWN,
    accidentFrameVehicleOneHN,
    accidentFrameVehicleTwoId,
    accidentFrameVehicleTwoX,
    accidentFrameVehicleTwoY,
    accidentFrameVehicleTwoW,
    accidentFrameVehicleTwoH,
    accidentFrameVehicleTwoXN,
    accidentFrameVehicleTwoYN,
    accidentFrameVehicleTwoWN,
    accidentFrameVehicleTwoHN
  ) 
  VALUES (
    @path,
    @fps,
    @trimStart,
    @trimEnd,
    @accidentModelConfidenceThreshold,
    @accidentModelIOUThreshold,
    @deepSORTModel,
    @accidentFrame,
    @accidentAreaX,
    @accidentAreaY,
    @accidentAreaW,
    @accidentAreaH,
    @accidentAreaXN,
    @accidentAreaYN,
    @accidentAreaWN,
    @accidentAreaHN,
    @accidentFrameVehicleOneId,
    @accidentFrameVehicleOneX,
    @accidentFrameVehicleOneY,
    @accidentFrameVehicleOneW,
    @accidentFrameVehicleOneH,
    @accidentFrameVehicleOneXN,
    @accidentFrameVehicleOneYN,
    @accidentFrameVehicleOneWN,
    @accidentFrameVehicleOneHN,
    @accidentFrameVehicleTwoId,
    @accidentFrameVehicleTwoX,
    @accidentFrameVehicleTwoY,
    @accidentFrameVehicleTwoW,
    @accidentFrameVehicleTwoH,
    @accidentFrameVehicleTwoXN,
    @accidentFrameVehicleTwoYN,
    @accidentFrameVehicleTwoWN,
    @accidentFrameVehicleTwoHN
  )`).run({
    path: video.path,
    fps: video.fps,
    trimStart: video.trimStart,
    trimEnd: video.trimEnd,
    accidentModelConfidenceThreshold: video.accidentModelConfidenceThreshold,
    accidentModelIOUThreshold: video.accidentModelIOUThreshold,
    deepSORTModel: video.deepSORTModel,
    accidentFrame: video.accidentFrame,
    accidentAreaX: video.accidentArea?.x,
    accidentAreaY: video.accidentArea?.y,
    accidentAreaW: video.accidentArea?.w,
    accidentAreaH: video.accidentArea?.h,
    accidentAreaXN: video.accidentArea?.xn,
    accidentAreaYN: video.accidentArea?.yn,
    accidentAreaWN: video.accidentArea?.wn,
    accidentAreaHN: video.accidentArea?.hn,
    accidentFrameVehicleOneId: video.accidentFrameVehicleOne?.id,
    accidentFrameVehicleOneX: video.accidentFrameVehicleOne?.x,
    accidentFrameVehicleOneY: video.accidentFrameVehicleOne?.y,
    accidentFrameVehicleOneW: video.accidentFrameVehicleOne?.w,
    accidentFrameVehicleOneH: video.accidentFrameVehicleOne?.h,
    accidentFrameVehicleOneXN: video.accidentFrameVehicleOne?.xn,
    accidentFrameVehicleOneYN: video.accidentFrameVehicleOne?.yn,
    accidentFrameVehicleOneWN: video.accidentFrameVehicleOne?.wn,
    accidentFrameVehicleOneHN: video.accidentFrameVehicleOne?.hn,
    accidentFrameVehicleTwoId: video.accidentFrameVehicleTwo?.id,
    accidentFrameVehicleTwoX: video.accidentFrameVehicleTwo?.x,
    accidentFrameVehicleTwoY: video.accidentFrameVehicleTwo?.y,
    accidentFrameVehicleTwoW: video.accidentFrameVehicleTwo?.w,
    accidentFrameVehicleTwoH: video.accidentFrameVehicleTwo?.h,
    accidentFrameVehicleTwoXN: video.accidentFrameVehicleTwo?.xn,
    accidentFrameVehicleTwoYN: video.accidentFrameVehicleTwo?.yn,
    accidentFrameVehicleTwoWN: video.accidentFrameVehicleTwo?.wn,
    accidentFrameVehicleTwoHN: video.accidentFrameVehicleTwo?.hn,
  });
  const videoDataFolder = getVideoDataFolder(statement.lastInsertRowid);
  fs.mkdirSync(videoDataFolder);

  const tempFolder = path.join(app.getPath('userData'), 'temp');
  await fsExtra.copy(tempFolder, videoDataFolder);
  await fsExtra.emptyDir(tempFolder);
  
  await createThumbnail(video.path, statement.lastInsertRowid);

  return statement.lastInsertRowid;
}

export function selectAllVideos(db: Database.Database) {
  const dbVideos = db.prepare('SELECT * FROM videos').all() as DatabaseVideoData[]
  const videos: VideoData[] = dbVideos.map((dbVideo) => convertDatabaseVideoData(dbVideo))
  return videos
}

export function selectVideo(db: Database.Database, id: number | bigint) {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(id) as DatabaseVideoData;
  return convertDatabaseVideoData(video);
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

export function getVideoFPS(videoPath: string) {
  return new Promise<number>((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err)
        return;
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const frameRate = videoStream?.avg_frame_rate;
      if (!frameRate) {
        reject(new Error("Could not get frame rate of video."))
        return;
      }
      
      const [numerator, denominator] = frameRate!.split('/')
      console.log(`getVideoFPS: videoPath = ${videoPath}`)
      console.log(`getVideoFPS: video path exists: ${fs.existsSync(videoPath)}`)
      console.log(`getVideoFPS: frameRate = ${frameRate}`);

      resolve(parseInt(numerator) / parseInt(denominator))
    })
  })
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
  console.log(`extractFrames: trimmedVideoPath = ${trimmedVideoPath}`);

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

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const frameRate = videoStream?.avg_frame_rate;
      if (!frameRate) {
        reject(new Error("Could not get frame rate of video."))
        return;
      }

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

export function runAccidentDetectionModel(confidenceThreshold: number, iouThreshold: number) {
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
  pythonProcess = spawn('python', [scriptPath, framesFolderPath, outputFolderPath, rootFolderPath, confidenceThreshold.toString(), iouThreshold.toString()]);
  
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

    pythonProcess.stderr.pipe(process.stderr);
  
    pythonProcess.on('exit', (code) => {
      console.log(`Python exited with code ${code}`);
      resolve(code);
    })
  })
}

export function runDeepSORTModel(yoloModel: string) {
  let scriptPath = path.join(
    app.getAppPath(),
    'python-scripts',
    'yolov8-deepsort',
    'ultralytics_yolov8_deepsort',
    'yolo',
    'v8',
    'detect',
    'predict.py'
  );
  let inputVideoPath = path.join(
    app.getPath('userData'),
    'temp',
    'trimmed.mp4'
  );
  let outputFolderPath = path.join(
    app.getPath('userData'),
    'temp'
  );

  console.log(`runDeepSORTModel: scriptPath = ${scriptPath}`);
  console.log(`runDeepSORTModel: inputVideoPath = ${inputVideoPath}`);
  console.log(`runDeepSORTModel: outputFolderPath = ${outputFolderPath}`);

  
  if (pythonProcess) {
    pythonProcess.kill();
  }
  pythonProcess = spawn('python', [
    scriptPath,
    `model=${yoloModel}`,
    `source="${inputVideoPath}"`,
    `save_dir="${outputFolderPath}"`,
  ]);

  return new Promise((resolve, reject) => {
    pythonProcess.on('error', (err) => {
      console.log("Python script error")
      console.log(err)
      reject(err);
    })
  
    pythonProcess.on('exit', (code) => {
      console.log(`Python exited with code ${code}`);

      if (code === 0) {
        try {
          const deepSORTOutputFile = fs.readFileSync(path.join(outputFolderPath, 'deepsort-output.json'), "utf-8");
          const deepSORTOutput = JSON.parse(deepSORTOutputFile);
          resolve(deepSORTOutput);
        } catch (error) {
          console.error("Error reading or parsing the JSON file:", error);
          reject(error)
        }
      }
    })
  })
}

// NOTE: This is needed because the DeepSORT video file created from the Python script cannot be accessed due to an unknown bug.
export function copyDeepSORTVideo() {
  const tempFolderPath = path.join(app.getPath('userData'), 'temp')
  const oldVideoPath = path.join(tempFolderPath, 'deepsort.mp4')
  const newVideoPath = path.join(tempFolderPath, 'deepsort-output.mp4')

  return new Promise<void>((resolve, reject) => {
    ffmpeg(oldVideoPath)
    .output(newVideoPath)
    .on('end', () => { 
      console.log('Finished copying deepSORT video.');
      fs.rmSync(oldVideoPath, { force: true })
      resolve();
    })
    .on('error', (err) => { 
      console.log('An error occurred: ' + err.message); 
      reject(err);
    })
    .run();
  });
}

export function getAccidentDetectionModelResults(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);
  if (video) {
    const accidentDetectionModelResults = fs.readFileSync(path.join(app.getPath('userData'), 'videos', id.toString(), 'accident-detection-output.json'), "utf-8");
    return JSON.parse(accidentDetectionModelResults);
  }
}

export function getDeepSORTModelResults(db: Database.Database, id: number | bigint) {
  const video: any = db.prepare(`SELECT * FROM videos WHERE id = ?`).get(id);
  if (video) {
    const deepSORTModelResults = fs.readFileSync(path.join(app.getPath('userData'), 'videos', id.toString(), 'deepsort-output.json'), "utf-8");
    return JSON.parse(deepSORTModelResults);
  }
}