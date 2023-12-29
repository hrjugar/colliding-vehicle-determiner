import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = import.meta.env.VITE_EXPRESS_PORT as number;

app.get('/video', (req, res) => {
  const reqPath = req.query.path;
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  if (!reqPath) {
    res.status(400).send("Missing video path");
    return;
  }

  const videoPath = path.resolve(reqPath as string);
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