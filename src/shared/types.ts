interface VideoDataInput {
  fps: number;
  path: string;
  trimStart: number;
  trimEnd: number;
  accidentModelConfidenceThreshold: number;
  accidentModelIOUThreshold: number;
  deepSORTModel: YOLOModel;
  accidentFrame?: number;
  accidentArea?: BoundingBox;
  accidentFrameVehicleOne?: BoundingBox;
  accidentFrameVehicleTwo?: BoundingBox;
}

interface VideoData extends VideoDataInput {
  id: number | bigint;
}

interface BoundingBox {
  x: number,
  y: number,
  w: number,
  h: number,
  xn: number,
  yn: number,
  wn: number,
  hn: number,
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