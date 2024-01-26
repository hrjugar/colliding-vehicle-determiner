import { vehicleClassifications } from "./constants";

function getIOU(accidentArea: BoundingBox, vehicleCoordinates: BoundingBoxWithId): number {
  const intersectionX = Math.max(accidentArea.x, vehicleCoordinates.x);
  const intersectionY = Math.max(accidentArea.y, vehicleCoordinates.y);
  const intersectionWidth = Math.min(accidentArea.x + accidentArea.w, vehicleCoordinates.x + vehicleCoordinates.w) - intersectionX;
  const intersectionHeight = Math.min(accidentArea.y + accidentArea.h, vehicleCoordinates.y + vehicleCoordinates.h) - intersectionY;

  const intersectionArea = Math.max(0, intersectionWidth) * Math.max(0, intersectionHeight);
  const unionArea = (accidentArea.w * accidentArea.h) + (vehicleCoordinates.w * vehicleCoordinates.h) - intersectionArea;

  return intersectionArea / unionArea;
}

export function getInvolvedVehicles(deepSORTOutput: DeepSORTOutput, accidentFrame?: number, accidentArea?: BoundingBox): Array<BoundingBoxWithId | undefined> {
  if (accidentFrame === undefined || accidentArea === undefined) return [];

  const accidentFrameVehicles: BoundingBoxWithId[] = [];
  for (const obj of deepSORTOutput) {
    if (!vehicleClassifications.includes(obj.classification)) continue;

    const frameItem = obj.frames.find((frame) => frame.frame === accidentFrame);

    if (!frameItem) continue;

    accidentFrameVehicles.push({
      id: obj.id,
      ...frameItem
    });
  }

  const finalAccidentFrameVehicles: BoundingBoxWithId[] = [];
  for (const vehicle of accidentFrameVehicles) {
    if (finalAccidentFrameVehicles.length > 2) {
      const vehicleOneIOU = getIOU(accidentArea, finalAccidentFrameVehicles[0])
      const vehicleTwoIOU = getIOU(accidentArea, finalAccidentFrameVehicles[1]);
      const currentVehicleIOU = getIOU(accidentArea, vehicle);

      if (currentVehicleIOU > vehicleOneIOU && currentVehicleIOU > vehicleTwoIOU) {
        finalAccidentFrameVehicles[vehicleOneIOU < vehicleTwoIOU ? 0 : 1] = vehicle;
      } else if (currentVehicleIOU > vehicleOneIOU) {
        finalAccidentFrameVehicles[0] = vehicle;
      } else if (currentVehicleIOU > vehicleTwoIOU) {
        finalAccidentFrameVehicles[1] = vehicle;
      }
    } else {
      finalAccidentFrameVehicles.push(vehicle);
    }
  }

  finalAccidentFrameVehicles.sort((a, b) => getIOU(accidentArea, b) - getIOU(accidentArea, a));
  return finalAccidentFrameVehicles;
}