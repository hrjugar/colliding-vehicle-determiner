interface Video {
  id: number | bigint;
  path: string;
}

interface DeepSORTFrame {
  frame: number,
  x: number,
  y: number,
  w: number,
  h: number,
  xn: number,
  yn: number,
  wn: number,
  hn: number,
}

interface DeepSORTObject {
  id: number,
  classification: string,
  frames: DeepSORTFrame[],
}

type DeepSORTOutput = DeepSORTObject[];

type YOLOModel = "yolov8n.pt" | "yolov8s.pt" | "yolov8m.pt" | "yolov8l.pt" | "yolov8x.pt";