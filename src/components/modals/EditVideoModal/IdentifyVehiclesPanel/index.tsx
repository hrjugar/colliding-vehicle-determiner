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
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTabIndex === 2) {
      // RUN DEEPSORT HERE
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white p-4 flex flex-row justify-start items-start gap-4">
      <DetectedObjects />

      <div className='bg-black w-full flex justify-center items-center'>
        <video
          className="max-w-full max-h-full flex object-scale-down aspect-video"
          muted
        >
          <source 
            src={`http://localhost:3000/video?source=app&temp=true`} 
            type="video/mp4" 
          />
        </video>
      </div>
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
