import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import AreaCard from "./AreaCard";
import { AreaType } from "./types";
import AreaFrameBoundingBox from "./AreaFrameBoundingBox";

const getFrameDarkenerStyle = (video: VideoData, hoveredArea: AreaType | null): React.CSSProperties => {
  if (hoveredArea === null) return {};

  let videoArea: BoundingBox | BoundingBoxWithId | undefined;
  switch (hoveredArea) {
    case AreaType.Accident:
      videoArea = video.accidentArea;
      break;
    case AreaType.VehicleOne:
      videoArea = video.accidentFrameVehicleOne;
      break;
    case AreaType.VehicleTwo:
      videoArea = video.accidentFrameVehicleTwo;
      break;
  }

  let left = videoArea!.xn * 100 - videoArea!.wn * 50;
  let top = videoArea!.yn * 100 - videoArea!.hn * 50;
  
  let right = videoArea!.xn * 100 + videoArea!.wn * 50;
  let bottom = videoArea!.yn * 100 + videoArea!.hn * 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${right - left}%`,
    height: `${bottom - top}%`,
    boxShadow: `0 0 0 calc(100vw + 100vh) rgba(0, 0, 0, 0.75)`,
  }
};

const FrameSection: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const imageRef = useRef<HTMLImageElement>(null);
  const boundingBoxAreaRef = useRef<HTMLDivElement>(null);
  const [hoveredArea, setHoveredArea] = useState<AreaType | null>(null);

  const updateBoundingBoxAreaSize = () => {
    if (imageRef.current && boundingBoxAreaRef.current) {
      const aspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
      const areaWidth = imageRef.current.offsetWidth;
      const areaHeight = areaWidth / aspectRatio;

      boundingBoxAreaRef.current.style.width = `${areaWidth}px`;
      boundingBoxAreaRef.current.style.height = `${areaHeight}px`;
    }
  }

  useEffect(() => {
    updateBoundingBoxAreaSize();
    const resizeObserver = new ResizeObserver(() => updateBoundingBoxAreaSize());
    if (imageRef.current) {
      resizeObserver.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        resizeObserver.unobserve(imageRef.current);
      }
    }
  }, [imageRef])

  return (
    <section className="w-full h-[80vh] flex flex-col">
      {video.accidentFrame ? (
        <div className="flex flex-col w-full flex-grow gap-2">
          <div className="relative card w-full flex-grow bg-black flex justify-center items-center h-[50vh]">
            <img 
              src={`filehandler://frame//${video.id}//${video.accidentFrame}`} 
              className="object-contain max-w-full max-h-full"
              ref={imageRef}
              onLoad={updateBoundingBoxAreaSize}
            />

            <div
              ref={boundingBoxAreaRef}
              className="absolute overflow-hidden"
            >
              <div 
                className="absolute" 
                style={ getFrameDarkenerStyle(video, hoveredArea) }
              />

              {video.accidentArea ? (
                <>
                  <AreaFrameBoundingBox 
                    boxAreaType={AreaType.Accident}
                    currentHoveredArea={hoveredArea}
                    setHoveredArea={setHoveredArea}
                    video={video}
                  />

                  {video.accidentFrameVehicleOne ? (
                    <AreaFrameBoundingBox 
                      boxAreaType={AreaType.VehicleOne}
                      currentHoveredArea={hoveredArea}
                      setHoveredArea={setHoveredArea}
                      video={video}
                    />         
                  ) : null}

                  {video.accidentFrameVehicleTwo ? (
                    <AreaFrameBoundingBox 
                      boxAreaType={AreaType.VehicleTwo}
                      currentHoveredArea={hoveredArea}
                      setHoveredArea={setHoveredArea}
                      video={video}
                    />                        
                  ) : null}
                </>
              ) : null}
              {/* <div 
                className="absolute border-2 border-red-400"
                style={
                  left: `${(video.accidentArea!.xn - video.accidentArea!.wn / 2) * 100}%`,
                  top: `${(video.accidentArea!.yn - item.hn / 2) * 100}%`,
                  width: `${(item.wn) * 100}%`,
                  height: `${(item.hn) * 100}%`,
                  zIndex: Math.round(item.confidence * 100),
                  transformOrigin: 'top left',                  
                }
              /> */}
            </div>
          </div>

          <div className="flex flex-row gap-4 px-1 justify-center max-w-full">
            <AreaCard 
              cardAreaType={AreaType.Accident}
              currentHoveredArea={hoveredArea}
              setHoveredArea={setHoveredArea}
              video={video}
            />

            {video.accidentFrameVehicleOne ? (
              <AreaCard 
                cardAreaType={AreaType.VehicleOne}
                currentHoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                video={video}
              />
            ) : null}

            {video.accidentFrameVehicleTwo ? (
              <AreaCard 
                cardAreaType={AreaType.VehicleTwo}
                currentHoveredArea={hoveredArea}
                setHoveredArea={setHoveredArea}
                video={video}
              />
            ) : null}                   
          </div>
        </div>
      ) : (
        <p>Video has no accident frame</p>
      )}
    </section>
  )
};

export default FrameSection;