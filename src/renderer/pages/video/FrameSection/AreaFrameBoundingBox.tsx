import { AreaType } from "./types"

interface AreaFrameBoundingBoxProps {
  boxAreaType: AreaType,
  currentHoveredArea: AreaType | null,
  setHoveredArea: (hoveredArea: AreaType | null) => void,
  video: VideoData
}

const AreaFrameBoundingBox: React.FC<AreaFrameBoundingBoxProps> = ({
  boxAreaType,
  currentHoveredArea,
  setHoveredArea,
  video,
}) => {
  let videoArea: BoundingBox | BoundingBoxWithId;
  let boxClasses: string;

  switch (boxAreaType) {
    case AreaType.Accident:
      videoArea = video.accidentArea!;
      boxClasses = `border-dashed border-red-400 ${currentHoveredArea === boxAreaType ? 'bg-red-400/25' : 'bg-red-400/5'}`;
      break;
    case AreaType.VehicleOne:
      videoArea = video.accidentFrameVehicleOne!;
      boxClasses = `border-green-400 ${currentHoveredArea === boxAreaType ? 'bg-green-400/25' : 'bg-green-400/5'}`;
      break;
    case AreaType.VehicleTwo:
      videoArea = video.accidentFrameVehicleTwo!;
      boxClasses = `border-blue-400 ${currentHoveredArea === boxAreaType ? 'bg-blue-400/25' : 'bg-blue-400/5'}`;
      break;
  }
  
  return (
    <div
      className={`absolute transition-all border-2 ${boxClasses} ${currentHoveredArea === boxAreaType ? 'z-[1] opacity-100' : currentHoveredArea === null ? 'opacity-75' : 'opacity-0'}`}
      onMouseOver={(e) => {e.stopPropagation(); setHoveredArea(boxAreaType); }}
      onMouseLeave={() => {
        if (currentHoveredArea === boxAreaType) {
          setHoveredArea(null);
        }
      }}
      style={{
        left: `${(videoArea.xn - videoArea.wn / 2) * 100}%`,
        top: `${(videoArea.yn - videoArea.hn / 2) * 100}%`,
        width: `${(videoArea.wn) * 100}%`,
        height: `${(videoArea.hn) * 100}%`,
        transformOrigin: 'top left',     
      }}
    />
  )
}

export default AreaFrameBoundingBox;