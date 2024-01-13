import { useRef } from "react";

const TrimmingSliderFrames: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className='absolute w-full h-full'>
      <canvas className='w-full h-full' ref={canvasRef} />
    </div>
  );
};

export default TrimmingSliderFrames;
