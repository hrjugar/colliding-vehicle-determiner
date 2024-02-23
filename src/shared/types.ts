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
  accidentFrameVehicleOne?: BoundingBoxWithIdAndProbability;
  accidentFrameVehicleTwo?: BoundingBoxWithIdAndProbability;
}

interface VideoData extends VideoDataInput {
  id: number | bigint;
  timestamp?: string;
}

interface DatabaseVideoData {
  id: number | bigint;
  path: string;
  fps: number;
  trimStart: number;
  trimEnd: number;
  accidentModelConfidenceThreshold: number;
  accidentModelIOUThreshold: number;
  deepSORTModel: YOLOModel;
  accidentFrame?: number;
  accidentAreaX?: number;
  accidentAreaY?: number;
  accidentAreaW?: number;
  accidentAreaH?: number;
  accidentAreaXN?: number;
  accidentAreaYN?: number;
  accidentAreaWN?: number;
  accidentAreaHN?: number;
  accidentFrameVehicleOneId?: number;
  accidentFrameVehicleOneX?: number;
  accidentFrameVehicleOneY?: number;
  accidentFrameVehicleOneW?: number;
  accidentFrameVehicleOneH?: number;
  accidentFrameVehicleOneXN?: number;
  accidentFrameVehicleOneYN?: number;
  accidentFrameVehicleOneWN?: number;
  accidentFrameVehicleOneHN?: number;
  accidentFrameVehicleOneProbability?: number;
  accidentFrameVehicleTwoId?: number;
  accidentFrameVehicleTwoX?: number;
  accidentFrameVehicleTwoY?: number;
  accidentFrameVehicleTwoW?: number;
  accidentFrameVehicleTwoH?: number;
  accidentFrameVehicleTwoXN?: number;
  accidentFrameVehicleTwoYN?: number;
  accidentFrameVehicleTwoWN?: number;
  accidentFrameVehicleTwoHN?: number;
  accidentFrameVehicleTwoProbability?: number;
  timestamp?: string;
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

interface BoundingBoxWithId extends BoundingBox {
  id: number | bigint;
}

interface BoundingBoxWithIdAndProbability extends BoundingBoxWithId {
  probability: number;
}

interface BoundingBoxWithVehicle extends BoundingBox {
  vehicle: number;
}

interface BoundingBoxWithConfidence extends BoundingBox {
  confidence: number;
}

interface DeepSORTFrame extends BoundingBox {
  frame: number,
}

interface DeepSORTObject {
  id: number,
  classification: string,
  frames: DeepSORTFrame[],
}

type DeepSORTOutput = DeepSORTObject[];

type YOLOModel = "yolov8n.pt" | "yolov8s.pt" | "yolov8m.pt" | "yolov8l.pt" | "yolov8x.pt";

interface GRUInput {
  [key: number]: BoundingBoxWithId[];
}

interface GRUOutput {
  vehicleOne: number;
  vehicleTwo: number;
  prediction: string;
}