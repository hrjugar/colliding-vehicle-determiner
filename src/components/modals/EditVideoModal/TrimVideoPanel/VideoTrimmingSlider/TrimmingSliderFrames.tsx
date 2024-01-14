import { useEffect, useRef, useState } from "react";
import useEditVideoModalStore from "../../store";
import { useMutation } from "react-query";
import { useShallow } from "zustand/react/shallow";

const TrimmingSliderFrames: React.FC = () => {
  const [areFramesLoaded, setAreFramesLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [
    selectedTabIndex,
    videoPath,
    fps,
    setFps
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.selectedTabIndex,
      state.videoPath,
      state.fps,
      state.setFps
    ])
  );

  const getVideoFPSMutation = useMutation(
    async (currentVideoPath: string) => await window.electronAPI.getVideoFPS(currentVideoPath),
    {
      onSuccess: (fps) => {
        setFps(fps);
      },
    }
  )

  const handleResizeRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (videoPath) {
      getVideoFPSMutation.mutate(videoPath);
    }
  }, [videoPath])

  useEffect(() => {
    if (fps <= 0 || canvasRef.current === null) return;

    let frameCallbackId: number;

    const video = document.createElement('video');
    video.src = `http://localhost:3000/video?path=${videoPath}`;
    video.currentTime = 0;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
    const offscreenCtx = offscreenCanvas.getContext('2d')!;

    const handleLoadedData = () => {
      let totalFrameCount = Math.round(canvas.width / (canvas.height * video.videoWidth / video.videoHeight));
      let frameWidth = canvas.width / totalFrameCount;

      const handleFrame = async (_: DOMHighResTimeStamp, __: any) => {
        if (selectedTabIndex !== 0) {
          if (frameCallbackId !== undefined) {
            video.cancelVideoFrameCallback(frameCallbackId);
          }

          return;
        }

        const xPos = (video.currentTime / video.duration) * canvas.width;        

        const imageBitmap = await createImageBitmap(video);
        offscreenCtx.drawImage(imageBitmap, xPos, 0, frameWidth, canvas.height);
      
        video.currentTime += video.duration / totalFrameCount;
        if (video.currentTime < video.duration) {
          frameCallbackId = video.requestVideoFrameCallback(handleFrame);
        } else {
          ctx.drawImage(offscreenCanvas, 0, 0);
          setAreFramesLoaded(true);
        }
      };

      const handleResize = () => {
        if (selectedTabIndex !== 0) {
          if (frameCallbackId !== undefined) {
            video.cancelVideoFrameCallback(frameCallbackId);
          }

          window.removeEventListener('resize', handleResizeRef.current)
          return;
        }

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        offscreenCanvas.width = rect.width;
        offscreenCanvas.height = rect.height;
    
        totalFrameCount = Math.round(canvas.width / (canvas.height * video.videoWidth / video.videoHeight));
        frameWidth = canvas.width / totalFrameCount;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        if (frameCallbackId !== undefined) {
          video.cancelVideoFrameCallback(frameCallbackId);
        }

        video.currentTime = 0;
        setAreFramesLoaded(false);
        frameCallbackId = video.requestVideoFrameCallback(handleFrame);
      }

      handleResizeRef.current = handleResize;
      window.addEventListener('resize', handleResizeRef.current);

      frameCallbackId = video.requestVideoFrameCallback(handleFrame)
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.pause();
      window.removeEventListener('resize', handleResizeRef.current);

      if (frameCallbackId !== undefined) {
        video.cancelVideoFrameCallback(frameCallbackId);
      }
    }
  }, [fps])

  return (
    <div className={`absolute w-full h-full bg-gray-300 ${areFramesLoaded ? '' : 'animate-pulse'}`}>
      <canvas className='w-full h-full' ref={canvasRef} />
    </div>
  );
};

export default TrimmingSliderFrames;
