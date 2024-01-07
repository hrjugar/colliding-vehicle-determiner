import express from 'express';
import fs from 'fs';
import path from 'path';
import { app as electronApp } from 'electron';

const app = express();
const port = import.meta.env.VITE_EXPRESS_PORT as number;

app.get('/video', (req, res) => {
  const source = req.query.source;
  let filePath;

  switch (source) {
    case 'app':
      console.log("source is app")
      console.log(req.query)

      if (req.query.temp) {
        filePath = path.join(electronApp.getPath('userData'), 'temp', 'trimmed.mp4');
        console.log(filePath);
      }

      break;
    default:
    case 'local':
      filePath = req.query.path;
      break;
  }

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  if (!filePath) {
    res.status(400).send("Missing video path");
    return;
  }

  const videoPath = path.resolve(filePath as string);
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
})

const server = app.listen(port, () => {
  console.log(`Video streaming app listening at http://localhost:${port}`)
})

export const stopServer = () => {
  console.log('Stopping server...')
  server.close();
}