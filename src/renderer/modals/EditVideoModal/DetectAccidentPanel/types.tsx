export interface PredictionBox {
  x: number;
  y: number;
  w: number;
  h: number;
  xn: number;
  yn: number;
  wn: number;
  hn: number;
  confidence: number;
}

export type FramePredictions = BoundingBoxWithConfidence[];

export interface AccidentDetectionModelProgress extends Progress {
  frame?: FramePredictions;
}

export interface PredictionBoxIndexes {
  frameIndex: number;
  boxIndex: number;
}

