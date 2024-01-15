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