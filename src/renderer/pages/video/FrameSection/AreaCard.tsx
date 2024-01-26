import { AreaType } from "./types";

interface AreaCardProps {
  cardAreaType: AreaType,
  currentHoveredArea: AreaType | null,
  setHoveredArea: (hoveredArea: AreaType | null) => void,
  video: VideoData
}

const getCroppedImageStyle = (boundingBox: BoundingBox) => {
  if (!boundingBox) return {};

  const top = boundingBox.yn * 100 - boundingBox.hn * 50;
  const right = 100 - (boundingBox.xn * 100 + boundingBox.wn * 50);
  const bottom = 100 - (boundingBox.yn * 100 + boundingBox.hn * 50);
  const left = boundingBox.xn * 100 - boundingBox.wn * 50;

  const widthScale = 1 / boundingBox.wn;
  const heightScale = 1 / boundingBox.hn;
  // const translateXValue = 50 - (boundingBox.xn * 100 + boundingBox.wn * 100 / 2);
  const translateXValue = 50 - (boundingBox.xn * 100 - boundingBox.wn);
  const translateYValue = 50 - (boundingBox.yn * 100 + boundingBox.hn);
  
  return {
    clipPath: `inset(
      ${top}%
      ${right}%
      ${bottom}%
      ${left}%
    )`,
    transform: `scale(${Math.min(widthScale, heightScale)}) translate(${translateXValue}%, ${translateYValue}%)`
  }
}

const AreaCard: React.FC<AreaCardProps> = ({
  cardAreaType,
  currentHoveredArea,
  setHoveredArea,
  video
}) => {
  let areaBox: BoundingBox | BoundingBoxWithId;
  let areaName: string;
  let boxClasses: string;

  switch (cardAreaType) {
    case AreaType.Accident:
      areaBox = video.accidentArea!;
      areaName = "Accident Area";
      boxClasses = "border-red-400 border-dashed bg-red-400/25";
      break;
    case AreaType.VehicleOne:
      areaBox = video.accidentFrameVehicleOne!;
      areaName = "Vehicle One";
      boxClasses = "border-green-400 bg-green-400";
      break;
    case AreaType.VehicleTwo:
      areaBox = video.accidentFrameVehicleTwo!;
      areaName = "Vehicle Two";
      boxClasses = "border-blue-400 bg-blue-400";
      break;
  }

  return (
    <div 
      className="card group flex flex-row"
      onMouseOver={(e) => {e.stopPropagation(); setHoveredArea(cardAreaType); }}
      onMouseLeave={() => {
        if (currentHoveredArea === cardAreaType) {
          setHoveredArea(null);
        }
      }}
    >
      <div className="flex flex-col items-center transition-all">
        <div className="bg-black overflow-hidden">
          <img 
            src={`filehandler://frame//${video.id}//${video.accidentFrame}`}
            className={`${currentHoveredArea === cardAreaType ? "h-[calc(16vh_+_38px)]" : "h-[16vh]"} w-full object-contain transition-all`}
            style={ getCroppedImageStyle(areaBox) }
          />
        </div>
        <div className={`card-header ${currentHoveredArea === cardAreaType ? "h-0 gap-0 p-0" : "h-[38px] gap-2"} justify-start transition-all`}>
          <div className={`${currentHoveredArea === cardAreaType ? "w-0 h-0 border-0" : "w-3 h-3 border-2"} ${boxClasses} transition-all`}/>
          <p className={`font-semibold ${currentHoveredArea === cardAreaType ? "text-[0px]" : "text-sm"} flex flex-row`}>{areaName}</p>
        </div>
      </div>

      <div className={`flex flex-col ${currentHoveredArea === cardAreaType ? "gap-2 text-sm" : "gap-0 text-[0px]"} text-left font-semibold transition-all`}>
        <div className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "px-4 py-2 gap-2" : "p-0 gap-0"} border-b-2 border-gray-300`}>
          <div className={`${currentHoveredArea === cardAreaType ? "w-3 h-3 border-2" : "border-0"} ${boxClasses} transition-all`}/>
          <p className="whitespace-nowrap text-left">{areaName}</p>
        </div>

        <div className={`${currentHoveredArea === cardAreaType ? "px-4 py-2 gap-x-4 gap-y-2" : "p-0 gap-0"} grid grid-rows-2 grid-cols-2`}>
          <p className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">X</span> <span className="font-medium">{Math.round(areaBox.x)}</span></p>
          <p className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">Y</span> <span className="font-medium">{Math.round(areaBox.y)}</span></p>
          <p className={`place-self-start flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">W</span> <span className="font-medium">{Math.round(areaBox.w)}</span></p>
          <p className={`place-self-start flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">H</span> <span className="font-medium">{Math.round(areaBox.h)}</span></p>
        </div>
      </div>
    </div>
  )
}

export default AreaCard;