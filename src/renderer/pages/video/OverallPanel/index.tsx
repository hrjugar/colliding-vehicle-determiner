import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import AreaCard from "./AreaCard";
import { AreaType } from "./types";
import AreaFrameBoundingBox from "./AreaFrameBoundingBox";
import { Tab } from "@headlessui/react";

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

const OverallPanel: React.FC = () => {
  const video = useLoaderData() as VideoData;

  let collidingVehicle = "NONE";
  let vehicleOneProbabilityStr = "0%";
  let vehicleTwoProbabilityStr = "0%";
  if (video.accidentFrameVehicleOne && video.accidentFrameVehicleTwo) {
    collidingVehicle = video.accidentFrameVehicleOne.probability > video.accidentFrameVehicleTwo.probability ? "Vehicle One" : "Vehicle Two";
    vehicleOneProbabilityStr = `${(video.accidentFrameVehicleOne.probability * 100).toFixed(2)}%`;
    vehicleTwoProbabilityStr = `${(video.accidentFrameVehicleTwo.probability * 100).toFixed(2)}%`;
  }

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
  }, [imageRef]);

  useEffect(() => {
    // Create a new style element
    const styleElement = document.createElement('style');
  
    // Define the keyframes with the dynamic end value
    styleElement.textContent = `
      @keyframes expandWidth {
        0% { width: 50%; }
        100% { width: ${vehicleOneProbabilityStr}; }
      }
    `;
  
    // Append the style element to the document head
    document.head.appendChild(styleElement);
  
    // Clean up function to remove the style element when the component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [vehicleOneProbabilityStr]);

  return (
    <Tab.Panel className="flex flex-col gap-4 pt-2">
      {video.accidentFrame ? (
        <>
          <section className="w-full h-[calc(100vh_-_64px_-_1rem)] flex flex-col gap-4">
            <div className="flex flex-col px-8">
              <p className="text-xl">Colliding Vehicle: <span className="font-semibold uppercase">{collidingVehicle}</span></p>
              {video.accidentFrameVehicleOne && video.accidentFrameVehicleTwo ? (
                <div className="flex flex-row items-center pt-2 whitespace-nowrap gap-4">
                  <p className={`${video.accidentFrameVehicleOne.probability > video.accidentFrameVehicleTwo.probability ? 'font-bold' : ''}`}>Vehicle One</p>
                  <div className="relative w-full flex flex-row h-10">
                    <div 
                      className="bg-green-400 h-full flex justify-start items-center pl-2 animate-expand-width overflow-hidden"
                      style={{
                        // width: vehicleOneProbabilityStr,
                        animation: 'expandWidth 1s forwards',
                      }}
                    >
                      <p className={`${video.accidentFrameVehicleOne.probability > video.accidentFrameVehicleTwo.probability ? 'text-black font-semibold' : 'text-black/50 font-medium'}`}>{vehicleOneProbabilityStr}</p>
                    </div>
                    <div 
                      className="bg-blue-400 flex-1 h-full flex justify-end items-center pr-2"
                    >
                      <p className={`${video.accidentFrameVehicleOne.probability < video.accidentFrameVehicleTwo.probability ? 'text-black font-semibold' : 'text-black/50 font-medium'}`}>{vehicleTwoProbabilityStr}</p>
                    </div>
                  </div>
                  <p className={`${video.accidentFrameVehicleOne.probability > video.accidentFrameVehicleTwo.probability ? '' : 'font-bold'}`}>Vehicle Two</p>
                </div>                
              ): null}
            </div>

            <div className="flex flex-col w-full h-full flex-grow gap-2">
              <div className="w-full flex-grow flex flex-col gap-2">    
                <div className="relative w-full flex-grow flex flex-col justify-center items-center h-0 bg-black">
                  <img 
                    src={`filehandler://frame//${video.id}//${video.accidentFrame}`} 
                    className="object-contain max-w-full h-full"
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
              </div>

              <div className="flex flex-row gap-4 px-4 py-4 justify-center max-w-full">
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

          </section>                     
        </>
      ) : (
        <h2 className=" pl-8 text-2xl text-left">Video has no accident frames.</h2>
      )}
    </Tab.Panel>
  )
};

// const OverallPanel: React.FC = () => {
//   const video = useLoaderData() as VideoData;

//   let collidingVehicle;
//   if (video.accidentFrameVehicleOne && video.accidentFrameVehicleTwo) {
//     collidingVehicle = video.accidentFrameVehicleOne.probability > video.accidentFrameVehicleTwo.probability ? "Vehicle One" : "Vehicle Two";
//   } else {
//     collidingVehicle = "None";
//   }
  
//   return (
//     <Tab.Panel className="flex flex-col gap-4 pl-8 pr-4 pt-2">
//       {video.accidentFrame ? (
//         <div className="flex flex-col gap-4">
//           <div className="bg-black h-full flex justify-start items-center rounded-xl overflow-hidden">
//             <img 
//               src={`filehandler://frame//${video.id}//${video.accidentFrame}`} 
//               className="object-scale-down w-full h-full max-h-[calc(100vh_-_20rem)]"          
//             />
//           </div>

//           <div className="flex flex-row gap-4">
//             <div className="row-span-2 flex flex-col card">
//               <div className="bg-black overflow-hidden">
//                 <img 
//                   src={`filehandler://frame//${video.id}//${video.accidentFrame}`}
//                   className="object-contain w-full h-full max-h-[calc(33vh_-_80px)]"
//                 />
//               </div>

//               <div className="flex flex-col px-4 py-2">
//                 <p className="font-semibold text-left">Accident Area</p>
//               </div>
//             </div>
//           </div>

//           <div></div>
//         </div>
//       ) : (
//         <h2 className=" pl-8 text-2xl text-left">Video has no accident frames.</h2>
//       )}
//     </Tab.Panel>
//   );
// }

export default OverallPanel;