import { BrowserWindow } from "electron";

const zmq: typeof import("zeromq") = require("zeromq");

export const serverSocket = new zmq.Reply;
const socketPort = import.meta.env.VITE_WEBSOCKET_PORT as number;
console.log(`Socket Port = ${socketPort}`)

export async function initSocket(win: BrowserWindow) {
  await serverSocket.bind(`tcp://127.0.0.1:${socketPort}`)

  for await (const [msg] of serverSocket) {
    const { model, progress } = JSON.parse(msg.toString());

    if (progress.frame !== undefined) {
      progress.frame = JSON.parse(progress.frame);
    }
    
    console.log(`message = ${msg.toString()}`);
    win.webContents.send(`model:${model}:progress`, progress);
    await serverSocket.send("success");
  }
}