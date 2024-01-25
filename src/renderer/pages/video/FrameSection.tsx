import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";

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

const FrameSection: React.FC = () => {
  const video = useLoaderData() as VideoData;

  const imageRef = useRef<HTMLImageElement>(null);
  const boundingBoxAreaRef = useRef<HTMLDivElement>(null);
  const [hoveredArea, setHoveredArea] = useState<"accident" | "vehicle1" | "vehicle2" | null>(null);

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
    <section className="w-full h-[80vh] flex flex-col bg-purple-400">
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
              className="absolute"
            >
              {video.accidentArea ? (
                <div
                className={`absolute border-2 border-red-400 ${hoveredArea === "accident" ? 'bg-red-400/50' : 'bg-red-400/5'} transition-colors border-dashed`}
                onMouseOver={() => setHoveredArea("accident")}
                onMouseLeave={() => setHoveredArea(null)}
                style={{
                  left: `${(video.accidentArea.xn - video.accidentArea.wn / 2) * 100}%`,
                  top: `${(video.accidentArea.yn - video.accidentArea.hn / 2) * 100}%`,
                  width: `${(video.accidentArea.wn) * 100}%`,
                  height: `${(video.accidentArea.hn) * 100}%`,
                  transformOrigin: 'top left',     
                }}
                />
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
            <div 
              className="card group flex flex-row group-hover:flex-grow"
              onMouseOver={() => setHoveredArea("accident")}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <div className="flex flex-col items-center transition-all">
                <div className="bg-black overflow-hidden">
                  <img 
                    src={`filehandler://frame//${video.id}//${video.accidentFrame}`}
                    className="h-[16vh] group-hover:h-[calc(16vh_+_38px)] w-full object-contain transition-all"
                    style={ getCroppedImageStyle(video.accidentArea!) }
                  />
                </div>
                <div className="card-header h-[38px] justify-start gap-2 group-hover:gap-0 group-hover:h-0 group-hover:p-0 transition-all">
                  <div className="w-3 h-3 group-hover:w-0 group-hover:h-0 border-2 group-hover:border-0 border-dashed border-red-400 bg-red-400/25 transition-all"/>
                  <p className="font-semibold text-sm group-hover:text-[0px] flex flex-row">Accident Area</p>
                </div>
              </div>

              <div className="flex flex-col gap-0 group-hover:gap-2 text-left text-[0px] group-hover:text-sm font-semibold transition-all">
                <div className="flex flex-row items-center p-0 group-hover:px-4 group-hover:py-2 border-b-2 border-gray-300 gap-0 group-hover:gap-2">
                  <div className="group-hover:w-3 group-hover:h-3 border-0 group-hover:border-2 border-dashed border-red-400 bg-red-400/25 transition-all"/>
                  <p className="whitespace-nowrap text-left">Accident Area</p>
                </div>

                <div className="p-0 group-hover:px-4 group-hover:py-2 grid grid-rows-2 grid-cols-2 gap-0 group-hover:gap-x-4 group-hover:gap-y-2">
                  <p className="flex flex-row items-center gap-0 group-hover:gap-2"><span className="text-gray-400">X</span> <span className="font-medium">{Math.round(video.accidentArea!.x)}</span></p>
                  <p className="flex flex-row items-center gap-0 group-hover:gap-2"><span className="text-gray-400">Y</span> <span className="font-medium">{Math.round(video.accidentArea!.y)}</span></p>
                  <p className="place-self-start flex flex-row items-center gap-0 group-hover:gap-2"><span className="text-gray-400">W</span> <span className="font-medium">{Math.round(video.accidentArea!.w)}</span></p>
                  <p className="place-self-start flex flex-row items-center gap-0 group-hover:gap-2"><span className="text-gray-400">H</span> <span className="font-medium">{Math.round(video.accidentArea!.h)}</span></p>
                </div>
              </div>
            </div>

            <div className="card flex flex-col items-center">
              <img 
                src={`filehandler://frame//${video.id}//${video.accidentFrame}`}
                className="h-[16vh] w-full object-contain bg-black"
              />
              <div className="card-header">
                <p className="font-semibold text-sm">Vehicle One</p>
              </div>
            </div>

            <div className="card flex flex-col items-center">
              <img 
                src={`filehandler://frame//${video.id}//${video.accidentFrame}`}
                className="h-[16vh] w-full object-contain bg-black"
              />
              <div className="card-header">
                <p className="font-semibold text-sm">Vehicle Two</p>
              </div>
            </div>                        
          </div>
        </div>
      ) : (
        <p>Video has no accident frame</p>
      )}
    </section>
  )
};

export default FrameSection;