import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import useEditVideoModalStore from '../store';
import { useShallow } from 'zustand/react/shallow';
import useIdentifyVehiclesPanelStore from './store';
import DetectedObjects from './DetectedObjects';

interface IdentifyVehiclesPanelProps {
  selectedTabIndex: number,
}

const IdentifyVehiclesPanel: React.FC<IdentifyVehiclesPanelProps> = ({ selectedTabIndex }) => {
  const [
    isAccidentDetectionModelChanged
  ] = useEditVideoModalStore(
    useShallow((state) => [
      state.isAccidentDetectionModelChanged
    ])
  )

  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);

  const deepSORTMutation = useMutation(
    async () => await window.electronAPI.runDeepSORTModel(),
    {
      onMutate: () => {

      },
      onSuccess: (data) => {
        console.log(`Python DeepSORT script exit code: ${data}`)
        setIsLoadingDone(true);
      }
    }
  )
  useEffect(() => {
    console.log("IN IdentifyVehiclesPanel");
    console.log(`isAccidentDetectionModelChanged: ${isAccidentDetectionModelChanged}`);
    if (selectedTabIndex === 2 && isAccidentDetectionModelChanged) {
      setIsLoadingDone(false);
      console.log("RESET STATES IN IdentifyVehiclesPanel");
      deepSORTMutation.mutate();
      // RUN DEEPSORT HERE
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white p-4 flex flex-row justify-start items-start gap-4">
      {isLoadingDone ? (
        <>
          <DetectedObjects />

          <div className='bg-black w-full flex justify-center items-center'>
            {/* <video
              className="max-w-full max-h-full flex object-scale-down aspect-video"
              muted
            >
              <source 
                src={`http://localhost:3000/video?source=app&temp=true`} 
                type="video/mp4" 
              />
            </video> */}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
