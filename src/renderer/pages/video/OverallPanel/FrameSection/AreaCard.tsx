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
  let areaBox: BoundingBox | BoundingBoxWithIdAndProbability;
  let areaName: string;
  let boxClasses: string;
  let isCollidingVehicle = false;

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
      isCollidingVehicle = video.accidentFrameVehicleOne!.probability > video.accidentFrameVehicleTwo!.probability;
    break;
    case AreaType.VehicleTwo:
      areaBox = video.accidentFrameVehicleTwo!;
      areaName = "Vehicle Two";
      boxClasses = "border-blue-400 bg-blue-400";
      isCollidingVehicle = video.accidentFrameVehicleTwo!.probability > video.accidentFrameVehicleOne!.probability;
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
        <div className={`card-header border-0 ${currentHoveredArea === cardAreaType ? "h-0 gap-0 p-0" : "h-[38px] gap-2"} justify-start transition-all`}>
          <div className={`${currentHoveredArea === cardAreaType ? "w-0 h-0 border-0" : "w-3 h-3 border-2"} ${boxClasses} transition-all`}/>
          <p className={`whitespace-nowrap text-left font-semibold ${currentHoveredArea === cardAreaType ? "text-[0px]" : "text-sm"} flex flex-row`}>{areaName}</p>
          {isCollidingVehicle ? (
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg"
              className={`text-gray-500 ${currentHoveredArea === cardAreaType ? "w-0 h-0" : "w-4 h-4"} transition-all`}
            >
              <path 
                d="M26.6667 45.3334L13.3333 32L17.0933 28.2134L26.6667 37.7867L46.9067 17.5467L50.6667 21.3334M32 5.33337C28.4981 5.33337 25.0305 6.02313 21.7951 7.36325C18.5598 8.70338 15.6201 10.6676 13.1438 13.1439C8.14286 18.1448 5.33334 24.9276 5.33334 32C5.33334 39.0725 8.14286 45.8553 13.1438 50.8562C15.6201 53.3325 18.5598 55.2967 21.7951 56.6368C25.0305 57.977 28.4981 58.6667 32 58.6667C39.0725 58.6667 45.8552 55.8572 50.8562 50.8562C55.8572 45.8553 58.6667 39.0725 58.6667 32C58.6667 28.4981 57.9769 25.0305 56.6368 21.7951C55.2967 18.5598 53.3324 15.6201 50.8562 13.1439C48.38 10.6676 45.4403 8.70338 42.2049 7.36325C38.9696 6.02313 35.5019 5.33337 32 5.33337Z"
                className='fill-current'
              />
            </svg>        
          ) : null}
        </div>
      </div>

      <div className={`flex flex-col ${currentHoveredArea === cardAreaType ? "gap-2 text-sm" : "gap-0 text-[0px]"} text-left font-semibold transition-all`}>
        <div className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "px-4 py-2 gap-2" : "p-0 gap-0"} border-b-2 border-gray-300`}>
          <div className={`${currentHoveredArea === cardAreaType ? "w-3 h-3 border-2" : "border-0"} ${boxClasses} transition-all`}/>
          <p className="whitespace-nowrap text-left">{areaName}</p>
          {isCollidingVehicle ? (
            <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg"
            className={`text-gray-500 ${currentHoveredArea === cardAreaType ? "w-4 h-4" : "w-0 h-0"} transition-all`}
          >
            <path 
              d="M26.6667 45.3334L13.3333 32L17.0933 28.2134L26.6667 37.7867L46.9067 17.5467L50.6667 21.3334M32 5.33337C28.4981 5.33337 25.0305 6.02313 21.7951 7.36325C18.5598 8.70338 15.6201 10.6676 13.1438 13.1439C8.14286 18.1448 5.33334 24.9276 5.33334 32C5.33334 39.0725 8.14286 45.8553 13.1438 50.8562C15.6201 53.3325 18.5598 55.2967 21.7951 56.6368C25.0305 57.977 28.4981 58.6667 32 58.6667C39.0725 58.6667 45.8552 55.8572 50.8562 50.8562C55.8572 45.8553 58.6667 39.0725 58.6667 32C58.6667 28.4981 57.9769 25.0305 56.6368 21.7951C55.2967 18.5598 53.3324 15.6201 50.8562 13.1439C48.38 10.6676 45.4403 8.70338 42.2049 7.36325C38.9696 6.02313 35.5019 5.33337 32 5.33337Z"
              className='fill-current'
            />
          </svg>     
          ) : null}
        </div>

        <div className={`${currentHoveredArea === cardAreaType ? "px-4 gap-x-4 gap-y-2" : "p-0 gap-0"} grid grid-rows-3 grid-cols-2`}>
          <p className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">X</span> <span className="font-medium">{Math.round(areaBox.x)}</span></p>
          <p className={`flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">Y</span> <span className="font-medium">{Math.round(areaBox.y)}</span></p>
          <p className={`place-self-start flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">W</span> <span className="font-medium">{Math.round(areaBox.w)}</span></p>
          <p className={`place-self-start flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">H</span> <span className="font-medium">{Math.round(areaBox.h)}</span></p>

          {cardAreaType !== AreaType.Accident && areaBox && 'probability' in areaBox ? (
            <p className={`place-self-start flex flex-row items-center ${currentHoveredArea === cardAreaType ? "gap-2" : "gap-0"}`}><span className="text-gray-400">%</span> <span className="font-medium">{areaBox.probability.toFixed(4)}</span></p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AreaCard;