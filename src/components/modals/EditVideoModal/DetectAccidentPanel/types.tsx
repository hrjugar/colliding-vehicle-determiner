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

export type FramePredictions = PredictionBox[];

export interface Progress {
  percent: number;
  displayText: string;
  frame?: FramePredictions;
}

export interface PredictionBoxIndexes {
  frameIndex: number;
  boxIndex: number;
}
